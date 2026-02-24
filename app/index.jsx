/*import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome to Roomie!
      </ThemedText>
      
      <ThemedText style={styles.subtitle}>
        Find your perfect Roommate
      </ThemedText>

      <ThemedView style={styles.buttonContainer}>
        <Link href="/login" style={[styles.button, styles.loginButton]}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Login
          </ThemedText>
        </Link>

        <Link href="/signup" style={[styles.button, styles.signupButton]}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            Sign Up
          </ThemedText>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
    color: '#fff',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#007AFF',
  },
  signupButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});*/

import { Link } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.centerContainer}>
        <Image
          source={require('@/assets/images/RoomieLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <ThemedText type="title" style={styles.title}>
          Roomie
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          Find your perfect Roommate
        </ThemedText>

        <View style={styles.buttonContainer}>
          <Link href="/login" asChild>
            <TouchableOpacity style={[styles.button, styles.loginButton]}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Login
              </ThemedText>
            </TouchableOpacity>
          </Link>

          <Link href="/signup" asChild>
            <TouchableOpacity style={[styles.button, styles.signupButton]}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Sign Up
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A2BE2',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 60,
    textAlign: 'center',
    color: '#fff',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  signupButton: {
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});