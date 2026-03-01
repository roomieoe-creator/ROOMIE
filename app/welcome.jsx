import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import ScreenWrapper from "../components/ScreenWrapper";
import { hp, wp } from "../helpers/common";


export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper bg="#9932cc">
      {" "}
      {/* Light purple background */}
      <View style={styles.logoContainer}>
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require("../assets/images/RoomieLogo.png")}
        />
      </View>
      <Text style={styles.title}>Welcome to Roomie!</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Getting Started"
          buttonStyle={styles.buttonStyle}
          onPress={() => router.push("signup")}
        />

        <View style={styles.bottomTextContainer}>
          <Text style={styles.infoText}>Already have an account? </Text>
          <Pressable onPress={() => router.push("login")}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: hp(5),
  },
  welcomeImage: {
    width: wp(40), // not too big
    height: wp(40),
  },
  title: {
    flex: 0,
    textAlign: "center",
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#333",
    marginVertical: hp(2),
  },
  buttonContainer: {
    flex: 2,
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: wp(5),
  },
  buttonStyle: {
    width: "100%", // full width
    paddingVertical: hp(2),
    borderRadius: 10,
    backgroundColor: "#007AFF", // slightly darker purple for contrast
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(2),
  },
  infoText: {
    fontSize: hp(2),
    color: "#333",
  },
  loginText: {
    fontSize: hp(2),
    fontWeight: "bold",
    color: "black", // more pronounced purple for clickable
  },
});
