import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useAuthStore } from '../stores/AuthStore';

const HomeScreen: React.FC = () => {
  const { user, signOut } = useAuthStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {user?.picture && (
            <Image source={{ uri: user.picture }} style={styles.avatar} />
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.title}>IoT Claw Control</Text>
        <Text style={styles.subtitle}>Ready to play!</Text>

        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Machine Status</Text>
          <View style={styles.statusCard}>
            <Text style={styles.statusText}>Connected</Text>
            <View style={styles.statusIndicator} />
          </View>
        </View>

        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Controls</Text>
          <View style={styles.buttonGrid}>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>Move Left</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>Move Right</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>Move Forward</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>Move Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlButton, styles.primaryButton]}>
              <Text style={[styles.controlButtonText, styles.primaryButtonText]}>Grab</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlButton, styles.primaryButton]}>
              <Text style={[styles.controlButtonText, styles.primaryButtonText]}>Release</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Live Stream</Text>
          <View style={styles.streamPlaceholder}>
            <Text style={styles.streamText}>Video Stream</Text>
            <Text style={styles.streamSubtext}>Will connect to camera feed</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mainContent: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  controlSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4caf50',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  controlButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    minWidth: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#4285F4',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  primaryButtonText: {
    color: '#fff',
  },
  streamPlaceholder: {
    backgroundColor: '#fff',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streamText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  streamSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default HomeScreen;

