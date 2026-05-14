import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

const ProfilePage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('listed properties');

  const tabs = ['listed properties', 'events', 'joined properties'];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/homePage")}>
            <Text style={styles.title}>Roomie</Text>
          </TouchableOpacity>

          <Pressable onPress={() => router.push("/settings-profile")}>  
            <Feather name="settings" size={24} color="#000" />
          </Pressable>
        </View>

        <View style={styles.content}>
          {/* Profile Picture */}
          <TouchableOpacity style={styles.profilePic} onPress={() => {/* Handle add picture */}}>
            <Text>Add Picture</Text>
          </TouchableOpacity>

          {/* Followers and Following Buttons */}
          <View style={styles.buttonRow}>
            <Button 
              buttonStyle={{ backgroundColor: 'transparent' }} 
              textStyle={{ color: 'black', fontWeight: 'bold' }} 
              title="Followers" 
              onPress={() => {}} 
              hasShadow={false}       
            />
            <Button 
              buttonStyle={{ backgroundColor: 'transparent' }} 
              textStyle={{ color: 'black', fontWeight: 'bold' }} 
              title="Following" 
              onPress={() => {}} 
              hasShadow={false}
            />
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                style={[styles.tab, selectedTab === tab && styles.selectedTab]}
              >
                <Text style={[styles.tabText, selectedTab === tab && styles.selectedTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomBar}>
          <Pressable>
            <MaterialCommunityIcons name="party-popper" size={24} />
          </Pressable>

          <Pressable>
            <Feather name="message-circle" size={24} />
          </Pressable>

          <Pressable onPress={() => router.push("/profilePage")}>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 16,
  },
  title: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: hp(5),
    marginBottom: 90,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: wp(80),
    marginBottom: hp(3),
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  tab: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    marginHorizontal: wp(2),
    borderRadius: 10,
    backgroundColor: Colors.light.background,
  },
  selectedTab: {
    backgroundColor: '#8A2BE2',
  },
  tabText: {
    color: Colors.light.text,
  },
  selectedTabText: {
    color: Colors.light.background,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});