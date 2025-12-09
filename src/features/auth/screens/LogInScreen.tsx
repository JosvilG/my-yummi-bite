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
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Title from '@/shared/components/Title';
import LogInBackground from '@/shared/icons/loginBG';
import { loginUser } from '../services/authService';
import { COLORS, FONTS } from '@/constants/theme';
import type { AuthStackParamList } from '@/types/navigation';

export type LogInScreenProps = NativeStackScreenProps<AuthStackParamList, 'LogIn'>;

const LogInScreen: React.FC<LogInScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error ?? 'Unknown error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LogInBackground style={styles.background} />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Title color={COLORS.background}>My Yummi Bite</Title>
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
          <TouchableOpacity style={styles.confirmBtn} onPress={handleLogIn} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Confirm'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Text>Don't you have an account yet?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.register}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    top: 50,
    zIndex: -1000,
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  textInput: {
    width: '100%',
    color: COLORS.background,
    borderBottomWidth: 1,
    borderColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 50,
    fontSize: 16,
  },
  confirmBtn: {
    backgroundColor: COLORS.secondary,
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: 80,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.background,
  },
  signUpContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  register: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default LogInScreen;
