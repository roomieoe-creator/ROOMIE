import ScreenWrapper from '@/components/ScreenWrapper';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { auth } from '../../lib/firebase';

const SettingsProfile = () => {
  const router = useRouter();

  const onLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <ScreenWrapper>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Pressable onPress={() => router.push("/profilePage")}> 
            <Ionicons name="arrow-back-circle-outline" size={30} color="#000" />
          </Pressable>
        </View>

      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {__DEV__ ? (
          <Pressable
            style={styles.devButton}
            onPress={async () => {
              await AsyncStorage.setItem('filterAccessedFromSettings', 'true');
              await AsyncStorage.setItem('hasCompletedFilter', 'false');
              router.replace('/post-signup');
            }}
          >
            <Text style={styles.devButtonText}>Filter Settings</Text>
          </Pressable>
        ) : null}

        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
     </ScrollView>
    </ScreenWrapper>
  );
};

export default SettingsProfile;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  devButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginBottom: 16,
  },
  devButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
