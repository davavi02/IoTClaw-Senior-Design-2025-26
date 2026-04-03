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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { callProtectedRoute } from '../services/ApiService';
import { ReportErrorProps } from './Routes';
import HeaderBar from './HeaderBar';

const ReportErrorScreen: React.FC<ReportErrorProps> = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSubject('');
      setMessage('');
    }, [])
  );

  const onSubmit = async () => {
    const msg = message.trim();
    if (msg.length < 5) {
      Alert.alert('Describe the issue', 'Please enter at least 5 characters so we can help.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await callProtectedRoute('/api/report-error', {
        method: 'POST',
        body: JSON.stringify({
          subject: subject.trim() || 'General',
          message: msg,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        Alert.alert('Could not send', text || `Server error (${res.status})`);
        return;
      }
      Alert.alert('Thank you', 'Your report was sent. We will look into it.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Could not send', e instanceof Error ? e.message : 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View style={styles.screen}>
          <HeaderBar></HeaderBar>

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.screenTitle}>Report Error</Text>
            <Text style={styles.subtitle}>
              Tell us what went wrong. Include what you were doing and what you expected to happen.
            </Text>

            <View style={styles.card}>
              <Text style={styles.label}>Subject (optional)</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="e.g. Play screen freezes"
                placeholderTextColor="#6688aa"
                maxLength={200}
                editable={!submitting}
                returnKeyType="next"
              />

              <Text style={[styles.label, styles.labelSpaced]}>Details</Text>
              <TextInput
                style={[styles.input, styles.messageInput]}
                value={message}
                onChangeText={setMessage}
                placeholder="Describe the problem…"
                placeholderTextColor="#6688aa"
                multiline
                textAlignVertical="top"
                maxLength={4000}
                editable={!submitting}
              />
              <Text style={styles.charHint}>{message.length} / 4000</Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={onSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.submitButtonText}>Submit report</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={submitting}
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
  flex: { flex: 1 },
  screen: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
  screenTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#88AACC',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  card: {
    borderWidth: 3,
    borderColor: '#FF2F00',
    borderRadius: 4,
    backgroundColor: '#001F3F',
    padding: 16,
    marginBottom: 20,
  },
  label: { color: '#AAA', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  labelSpaced: { marginTop: 16 },
  input: {
    borderWidth: 2,
    borderColor: '#FF2F00',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: '#FFF',
    fontSize: 16,
    backgroundColor: '#0B0029',
  },
  messageInput: {
    minHeight: 160,
    paddingTop: Platform.OS === 'ios' ? 14 : 10,
  },
  charHint: { color: '#668899', fontSize: 12, marginTop: 8, textAlign: 'right' },
  submitButton: {
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
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: '#000', fontWeight: 'bold', fontSize: 20 },
  cancelButton: { paddingVertical: 12, alignItems: 'center' },
  cancelButtonText: { color: '#00E5FF', fontSize: 16, fontWeight: '600' },
});

export default ReportErrorScreen;
