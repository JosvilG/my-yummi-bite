import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import Title from '@/shared/components/Title';
import SignUpBG from '@/shared/icons/signUpBG';
import ReturnHeaderButton from '@/shared/components/ReturnHeaderButton';
import { registerUser } from '../services/authService';
import { COLORS, FONTS } from '@/constants/theme';

export default function SignUpScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!userName || !fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await registerUser(email, password, userName, fullName);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.error);
    }
    // Navigation is handled automatically by AppNavigator based on auth state
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SignUpBG style={styles.background} />
      <ReturnHeaderButton style={styles.returnButton} onPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Title color={COLORS.background}>Sign Up</Title>
          <TextInput
            placeholder="User Name"
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Repeat Password"
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Confirm'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  background: {
    position: 'absolute',
    top: 50,
    zIndex: -1,
  },
  returnButton: {
    marginTop: 50,
    marginLeft: 20,
    zIndex: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
    paddingTop: 20,
  },
  textInput: {
    width: '80%',
    borderBottomWidth: 1,
    borderColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 32,
    color: COLORS.background,
    fontSize: 16,
  },
  confirmBtn: {
    backgroundColor: COLORS.secondary,
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: 80,
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.background,
  },
});
