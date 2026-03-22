import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import CoinsButton from './CoinsButton';
import ClawzerTitle from '../assets/ClawzerTitle.png';
import { useAuthStore } from '../stores/AuthStore';
import { EditProfileProps } from './Routes';

const EditProfileScreen: React.FC<EditProfileProps> = ({ navigation }) => {
  const { user, updateDisplayName } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setDisplayName(user?.name ?? '');
    }, [user?.name])
  );

  const onSave = async () => {
    setSaving(true);
    const result = await updateDisplayName(displayName);
    setSaving(false);
    if (!result.ok) {
      Alert.alert('Could not save', result.error);
      return;
    }
    Alert.alert('Saved', 'Your display name was updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View style={styles.screen}>
          <View style={styles.headerOutline}>
            <View style={styles.headerSide}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerCenter}>
              <Image source={ClawzerTitle} style={styles.topLogo} />
            </View>
            <View style={[styles.headerSide, styles.headerSideRight]}>
              <CoinsButton onPress={() => navigation.navigate('Shop')} />
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.screenTitle}>Edit Profile</Text>

            <View style={styles.card}>
              <Text style={styles.label}>Display name</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name"
                placeholderTextColor="#6688aa"
                autoCapitalize="words"
                autoCorrect
                maxLength={120}
                editable={!saving}
                returnKeyType="done"
                onSubmitEditing={onSave}
              />

              <Text style={[styles.label, styles.labelSpaced]}>Email</Text>
              <View style={styles.readOnlyBox}>
                <Text style={styles.readOnlyText}>{user?.email ?? '—'}</Text>
              </View>
              <Text style={styles.hint}>Email is tied to your Google account and can’t be changed here.</Text>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={onSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0029',
  },
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  headerOutline: {
    width: '100%',
    minHeight: 91,
    borderBottomWidth: 3,
    borderBottomColor: '#FF2F00',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0B0029',
  },
  headerSide: {
    width: 100,
    justifyContent: 'center',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#00E5FF',
    fontSize: 16,
    fontWeight: '700',
  },
  topLogo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    borderWidth: 3,
    borderColor: '#FF2F00',
    borderRadius: 4,
    backgroundColor: '#001F3F',
    padding: 16,
    marginBottom: 20,
  },
  label: {
    color: '#AAA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  labelSpaced: {
    marginTop: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#FF2F00',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: '#FFF',
    fontSize: 18,
    backgroundColor: '#0B0029',
  },
  readOnlyBox: {
    borderWidth: 1,
    borderColor: '#335577',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#0B0029',
  },
  readOnlyText: {
    color: '#88AACC',
    fontSize: 16,
  },
  hint: {
    color: '#668899',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
  saveButton: {
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#00E5FF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
