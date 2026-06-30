/*import * as AppleAuthentication from "expo-apple-authentication";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import { CryptoDigestAlgorithm, digestStringAsync, getRandomBytesAsync } from "expo-crypto";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
    GoogleAuthProvider,
    OAuthProvider,
    signInWithCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import ScreenWrapper from "../components/ScreenWrapper";
import { hp, wp } from "../helpers/common";
import { auth, db } from "../lib/firebase";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_EXPO_CLIENT_ID = "<GOOGLE_EXPO_CLIENT_ID>";

const generateNonce = async (length = 32) => {
  const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._";
  const randomBytes = await getRandomBytesAsync(length);
  return Array.from(randomBytes)
    .map((byte: number) => charset[byte % charset.length])
    .join("");
};

const sha256 = async (value: string) => {
  return digestStringAsync(CryptoDigestAlgorithm.SHA256, value);
};

export default function AuthOptionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_EXPO_CLIENT_ID,
    scopes: ["profile", "email"],
    redirectUri: makeRedirectUri({ scheme: "roomieapp" }),
  });

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
  }, []);

  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      handleGoogleResult(response.authentication);
    }
  }, [response]);

  const createUserDocIfNeeded = async (
    uid: string,
    email: string | null,
    displayName: string | null
  ) => {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      await setDoc(userRef, {
        email: email ?? "",
        displayName: displayName ?? "",
        userType: "tenant",
        createdAt: new Date(),
        hasCompletedFilter: false,
      });
      return true;
    }
    return false;
  };

  const handleGoogleResult = async (authentication: any) => {
    setLoading(true);
    try {
      const idToken = authentication.idToken || authentication.id_token;
      const accessToken = authentication.accessToken || authentication.access_token;
      if (!idToken) {
        throw new Error("Google authentication returned no ID token.");
      }

      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const userCredential = await signInWithCredential(auth, credential);

      const isNewUser = await createUserDocIfNeeded(
        userCredential.user.uid,
        userCredential.user.email,
        userCredential.user.displayName
      );
      router.replace(isNewUser ? "/filter-preferences" : "/(main)/homePage");
    } catch (error: unknown) {
      Alert.alert(
        "Google sign-in failed",
        error instanceof Error ? error.message : "Unable to sign in with Google"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!request) {
      Alert.alert("Google sign-in is not ready yet.");
      return;
    }
    setLoading(true);
    try {
      await promptAsync();
    } catch (error: unknown) {
      Alert.alert(
        "Google sign-in failed",
        error instanceof Error ? error.message : "Unable to start Google sign-in"
      );
      setLoading(false);
    }
  };

  const isExpoGo = Constants.appOwnership === "expo";

  const handleAppleSignIn = async () => {
    if (!appleAvailable) {
      Alert.alert(
        "Apple sign-in unavailable",
        "Apple sign-in is not available on this device."
      );
      return;
    }

    if (isExpoGo) {
      Alert.alert(
        "Apple sign-in unavailable in Expo Go",
        "Firebase Apple auth fails in Expo Go because Apple issues an ID token with audience host.exp.Exponent. Build a custom app or standalone binary with your own bundle ID and configure Apple sign-in in Firebase."
      );
      return;
    }

    setLoading(true);
    try {
      const rawNonce = await generateNonce();
      const hashedNonce = await sha256(rawNonce);

      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!appleCredential.identityToken) {
        throw new Error("Apple sign-in did not return an identity token.");
      }

      const provider = new OAuthProvider("apple.com");
      const firebaseCredential = provider.credential({
        idToken: appleCredential.identityToken,
        rawNonce,
      });

      const userCredential = await signInWithCredential(auth, firebaseCredential);
      const isNewUser = await createUserDocIfNeeded(
        userCredential.user.uid,
        userCredential.user.email,
        userCredential.user.displayName
      );
      router.replace(isNewUser ? "/filter-preferences" : "/(main)/homePage");
    } catch (error: unknown) {
      Alert.alert(
        "Apple sign-in failed",
        error instanceof Error ? error.message : "Unable to sign in with Apple"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftSignIn = () => {
    Alert.alert(
      "Microsoft disabled",
      "Microsoft sign-in is currently not enabled."
    );
  };

  return (
    <ScreenWrapper bg="#9932cc">
      <View style={styles.container}>
        <Text style={styles.title}>Sign up with</Text>
        <Text style={styles.subtitle}>Choose an account provider to continue.</Text>

        <View style={styles.buttonsWrapper}>
          <Button
            title="Continue with Apple"
            buttonStyle={styles.providerButton}
            textStyle={styles.providerText}
            onPress={handleAppleSignIn}
            loading={loading}
            disabled={!appleAvailable || isExpoGo || loading}
          />
          <Button
            title="Continue with Google"
            buttonStyle={styles.providerButton}
            textStyle={styles.providerText}
            onPress={handleGoogleSignIn}
            loading={loading}
            disabled={!request || loading}
          />
          <Button
            title="Continue with Microsoft"
            buttonStyle={[styles.providerButton, styles.disabledButton]}
            textStyle={styles.providerText}
            onPress={handleMicrosoftSignIn}
            disabled
          />
        </View>

        {isExpoGo ? (
          <Text style={styles.expoWarning}>
            Apple sign-in is disabled in Expo Go. Use a custom dev client or standalone build to test Apple authentication.
          </Text>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.emailText}>Prefer email sign up?</Text>
          <Pressable onPress={() => router.push("/signup")}> 
            <Text style={styles.emailLink}>Continue with Email</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(6),
  },
  title: {
    fontSize: hp(3.4),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: hp(1),
    textAlign: "center",
  },
  subtitle: {
    color: "#ececec",
    fontSize: hp(2),
    textAlign: "center",
    marginBottom: hp(4),
    lineHeight: hp(3),
  },
  buttonsWrapper: {
    width: "100%",
    gap: hp(1.2),
  },
  providerButton: {
    width: "100%",
    paddingVertical: hp(2),
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  disabledButton: {
    opacity: 0.5,
  },
  providerText: {
    color: "#111",
  },
  footer: {
    marginTop: hp(4),
    alignItems: "center",
  },
  emailText: {
    color: "#ddd",
    fontSize: hp(2),
    marginBottom: hp(1),
  },
  expoWarning: {
    color: "#fff",
    fontSize: hp(1.8),
    textAlign: "center",
    marginTop: hp(2),
    marginHorizontal: wp(4),
  },
  emailLink: {
    color: "#fff",
    fontSize: hp(2.2),
    fontWeight: "bold",
  },
});
*/