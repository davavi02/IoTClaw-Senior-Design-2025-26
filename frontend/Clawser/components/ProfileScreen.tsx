import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import ProfileAvatar from '../assets/icons/PFP.png';
import useUserDataStore from '../stores/UserDataStore';
import { useAuthStore } from '../stores/AuthStore';
import { ProfileProps } from './Routes';
import HeaderBar from './HeaderBar';
import Background from './Background';

const ProfileScreen: React.FC<ProfileProps> = ({ navigation }) => {
  const { numTokens } = useUserDataStore();
  const { signOut, user } = useAuthStore();

  return (
      <Background>
        <HeaderBar useLogoInstead={true}></HeaderBar>

        {/* SCROLLABLE CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* PROFILE CARD */}
          <View style={styles.profileCardOutline}>
            <Image source={ProfileAvatar} style={styles.profileAvatar} />
            <View style={styles.profileText}>
              <Text style={styles.fullName}>{user?.name}</Text>
              <Text style={styles.username}>{user?.email}</Text>
            </View>
          </View>

          {/* ACTION SECTION */}
          <View style={styles.actionSectionOutline}>

            {/* SETTINGS BUTTON */}
            <View style={styles.settingsButtonOutline}>
              <TouchableOpacity style={styles.settingsButton}>
                <Text style={styles.settingsButtonText}>Settings</Text>
              </TouchableOpacity>
            </View>

            {/* CYAN ACTION BUTTONS */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Text style={styles.actionButtonText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}
                onPress={() => navigation.navigate('EditAddress')}
              >
                <Text style={styles.actionButtonText}>Edit Address</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('ReportError')}
              >
                <Text style={styles.actionButtonText}>Report Error</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('PrizeTracking')}
              >
                <Text style={styles.actionButtonText}>Prize Tracking</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => signOut()}
              >
                <Text style={styles.actionButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>

        {/* FIXED BOTTOM NAVBAR */}
        <BottomNavBar
          active="profile"
          onPressHome={() => navigation.navigate('Home', { from: 'Profile' })}
          onPressMap={() => navigation.navigate('Prize', { from: 'Profile' })}
          onPressProfile={() => navigation.navigate('Profile', { from: 'Profile' })}
        />
      </Background>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0029',
  },

  screen: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    paddingBottom: 100,
  },

  profileCardOutline: {
    width: 370,
    height: 159,
    borderWidth: 4,
    borderColor: '#FF2F00',
    borderRadius: 4,
    backgroundColor: '#001F3F',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 20,
  },

  profileAvatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    marginRight: 20,
  },

  profileText: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },

  username: {
    fontSize: 16,
    color: '#AAA',
    marginTop: 4,
    textAlign: 'center',
  },

  actionSectionOutline: {
    width: 370,
    height: 475,
    borderWidth: 3,
    borderColor: '#FF2F00',
    borderRadius: 3,
    padding: 15,
    backgroundColor: '#001F3F',
  },

  settingsButtonOutline: {
    width: 145,
    height: 45,
    borderWidth: 3,
    borderColor: '#FFF',
    borderRadius: 3,
    marginBottom: 15,
    alignSelf: 'center',
  },

  settingsButton: {
    flex: 1,
    backgroundColor: '#FF2F00',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingsButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  buttonsContainer: {
    marginTop: 10,
  },

  actionButton: {
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },

  actionButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'right',
    width: '100%',
  },
});

export default ProfileScreen;

