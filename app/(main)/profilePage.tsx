import ScreenWrapper from '@/components/ScreenWrapper';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Colors } from '../../constants/theme';
import { hp } from '../../helpers/common';
import { auth, db, storage } from '../../lib/firebase';

const ProfilePage = () => {
  const router = useRouter();
  const [description, setDescription] = useState('description');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setIsLoading(false);
          return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData?.description) {
            setDescription(userData.description);
          }
          if (userData?.profilePictureUrl) {
            setProfileImageUri(userData.profilePictureUrl);
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const saveProfileChanges = async () => {
    try {
      setIsSaving(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const updateData: any = { description };

      // Upload profile image if a new one was selected
      if (profileImageUri && !profileImageUri.startsWith('http')) {
        try {
          const response = await fetch(profileImageUri);
          const blob = await response.blob();
          const imageRef = ref(storage, `profilePictures/${user.uid}`);
          await uploadBytes(imageRef, blob);
          const downloadUrl = await getDownloadURL(imageRef);
          updateData.profilePictureUrl = downloadUrl;
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          Alert.alert('Error', 'Failed to upload profile picture');
          setIsSaving(false);
          return;
        }
      }

      await setDoc(userDocRef, updateData, { merge: true });
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', `Failed to save profile changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSaving(false);
    }
  };

  const handlePickerResult = (response: any) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'Unable to select image');
      return;
    }
    const asset = response.assets?.[0];
    if (asset?.uri) {
      setProfileImageUri(asset.uri);
    }
  };

  const chooseFromLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      handlePickerResult,
    );
  };

  const takePicture = () => {
    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
      },
      handlePickerResult,
    );
  };

  const chooseFile = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      handlePickerResult,
    );
  };

  const handleProfilePicPress = () => {
    if (!isEditingDescription) {
      return;
    }

    Alert.alert('Change profile picture', 'Select an option', [
      {
        text: 'Choose from library',
        onPress: chooseFromLibrary,
      },
      {
        text: 'Take picture',
        onPress: takePicture,
      },
      {
        text: 'Choose file',
        onPress: chooseFile,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleDescriptionToggle = async () => {
    if (isEditingDescription) {
      await saveProfileChanges();
    }
    setIsEditingDescription(prev => !prev);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/homePage')}>
            <Text style={styles.title}>Roomie</Text>
          </TouchableOpacity>

          <Pressable onPress={() => router.push('/settings-profile')}>
            <Feather name="settings" size={24} color="#000" />
          </Pressable>
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#8A2BE2" />
          ) : (
            <>
              <View style={styles.profileSection}>
                <Pressable style={styles.buttonSquare}>
                  <MaterialCommunityIcons name="party-popper" size={20} color="#8A2BE2" />
                </Pressable>

                <TouchableOpacity style={styles.profilePic} onPress={handleProfilePicPress}>
                  {profileImageUri ? (
                    <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
                  ) : (
                    <Text>Add Picture</Text>
                  )}
                </TouchableOpacity>

                <Pressable style={styles.buttonSquare}>
                  <Feather name="home" size={20} color="#8A2BE2" />
                </Pressable>
              </View>

              <Pressable style={styles.customizeButton} onPress={handleDescriptionToggle} disabled={isSaving}>
                <Text style={styles.customizeText}>
                  {isSaving ? 'Saving...' : (isEditingDescription ? 'Save' : 'Customize')}
                </Text>
              </Pressable>

              <View style={styles.descriptionBox}>
                {isEditingDescription ? (
                  <TextInput
                    style={styles.descriptionInput}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                    editable={!isSaving}
                  />
                ) : (
                  <Text style={styles.descriptionText}>{description}</Text>
                )}
              </View>
            </>
          )}
        </View>

        <View style={styles.bottomBar}>
          <Pressable>
            <MaterialCommunityIcons name="party-popper" size={24} />
          </Pressable>

          <Pressable>
            <Feather name="message-circle" size={24} />
          </Pressable>

          <Pressable onPress={() => router.push('/profilePage')}>
            <Feather name="user" size={24} />
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 16,
  },
  title: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: hp(5),
    paddingBottom: hp(12),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: hp(2),
  },
  profilePic: {
    width: hp(15),
    height: hp(15),
    borderRadius: hp(7.5),
    backgroundColor: Colors.light.background,
    borderWidth: 2,
    borderColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  buttonSquare: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customizeButton: {
    marginTop: hp(3),
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#8A2BE2',
    borderRadius: 8,
    alignItems: 'center',
  },
  customizeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionBox: {
    marginTop: hp(3),
    width: '90%',
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8A2BE2',
    backgroundColor: '#f9f5ff',
    alignSelf: 'center',
  },
  descriptionInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
  descriptionText: {
    fontSize: 14,
    color: '#000000',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: hp(7.5),
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});
