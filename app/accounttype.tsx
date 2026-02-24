import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AccountTypeScreen() {
  const params = useLocalSearchParams();
  
  // Get data from previous screen
  const { name, email, password, dob } = params;

  const handleTenant = () => {
    // Navigate to tenant-specific screen with user data
    router.push({
      pathname: '/tenantinfo',
      params: {
        name,
        email,
        password,
        dob,
        accountType: 'tenant'
      }
    });
  };

  const handleLandlord = () => {
    // Navigate to existing personalinfo screen with user data
    router.push({
      pathname: '/personalinfo',
      params: {
        name,
        email,
        password,
        dob,
        accountType: 'landlord'
      }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.centerContainer}>
        <ThemedText type="title" style={styles.title}>
          Choose Account Type
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          Are you looking to rent a property or list one for rent?
        </ThemedText>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.tenantButton]}
            onPress={handleTenant}
          >
            <ThemedText style={styles.buttonEmoji}>👤</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Tenant
            </ThemedText>
            <ThemedText style={styles.buttonSubtext}>
              Looking to rent a property
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.landlordButton]}
            onPress={handleLandlord}
          >
            <ThemedText style={styles.buttonEmoji}>🏠</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Landlord
            </ThemedText>
            <ThemedText style={styles.buttonSubtext}>
              Want to list a property for rent
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A2BE2', // Matching purple background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  tenantButton: {
    backgroundColor: '#4169E1', // Royal Blue (matching login button)
  },
  landlordButton: {
    backgroundColor: '#32CD32', // Lime Green - a nice complement to the purple
  },
  buttonEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
  },
});