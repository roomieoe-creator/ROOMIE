import ScreenWrapper from '@/components/ScreenWrapper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const NotificationPage = () => {
    const router = useRouter();

return (
    <ScreenWrapper>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Pressable onPress={() => router.push("/homePage")}> 
              <Ionicons name="arrow-back-circle-outline" size={30} color="#000" />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Notifications</Text>
          </View>
        </ScrollView>
     </ScreenWrapper>
)};


export default NotificationPage;

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
});