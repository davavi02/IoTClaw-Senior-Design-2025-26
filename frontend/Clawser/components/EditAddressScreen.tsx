import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuthStore } from '../stores/AuthStore';
import { EditProfileProps } from './Routes';
import HeaderBar from './HeaderBar';
import { callProtectedRoute } from '../services/ApiService';
import Address from '../types/AddressData';
import EditInputBox from './EditInputBox';

const EditAddressScreen: React.FC<EditProfileProps> = ({ navigation }) => {
  
  const { user, updateDisplayName } = useAuthStore();
  const [addr, setAddress] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadAddy = async () => {
      try {
        const response = await callProtectedRoute('/api/address', {
            method: 'GET' 
          });

          console.log("Server Status Code:", response.status);

        if (response.ok){
          const data = await response.json();
          setAddress(data);
        } else {
          const errorText = await response.text();
          console.log("Server Error Text:", errorText);
        }
      } catch (error) {
        console.error("Failed to load address data: ", error);
      }
    };

    loadAddy();
  }, []);

  const updateData = (field : string, value : string) => {
    setAddress(prev => prev ? { ...prev, [field]: value } : null);
  };

  const onSave = async () => {
    setSaving(true);
    
    try {
      const response = await callProtectedRoute(`/api/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addr)
      });

      if (response.ok) {
        Alert.alert('Saved', 'Your address was updated.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Could not save');
      }
    } catch (error) {
        Alert.alert('Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View>
          <HeaderBar></HeaderBar>

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.screenTitle}>Edit Address</Text>

            <EditInputBox label="Name" value={addr?.name ?? ''}
              onChangeFunc={(x:string)=>{updateData("name",x);}}
              placeholder="Your Name" maxLength={120} editable={!saving}
            />

            <EditInputBox label="Street" value={addr?.street ?? ''}
              onChangeFunc={(x:string)=>{updateData("street",x);}}
              placeholder="Your Street" maxLength={120} editable={!saving}
            />

            <EditInputBox label="City" value={addr?.city ?? ''}
              onChangeFunc={(x:string)=>{updateData("city",x);}}
              placeholder="Your City" maxLength={50} editable={!saving}
            />

            <EditInputBox label="Zipcode" value={ addr?.zipcode ?? ''}
              onChangeFunc={(x:string)=>{updateData("zipcode",x);}}
              placeholder="12345" maxLength={5} editable={!saving}
            />
              
            <EditInputBox label="State" value={addr?.state ?? ''}
              onChangeFunc={(x:string)=>{updateData("state",x);}}
              placeholder="TX" maxLength={2} editable={!saving}
            />

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
    </View>
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
  labelSpaced: {
    marginTop: 16,
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

export default EditAddressScreen;
