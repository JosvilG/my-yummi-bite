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
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Title from '@/shared/components/Title';
import SignUpBG from '@/shared/icons/signUpBG';
import ReturnHeaderButton from '@/shared/components/ReturnHeaderButton';
import { registerUser } from '../services/authService';
import { COLORS, FONTS } from '@/constants/theme';
import type { AuthStackParamList } from '@/types/navigation';

export type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    if (!userName || !fullName || !email || !password || !confirmPassword) {
      Alert.alert(t('common.error'), t('auth.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordsNoMatch'));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('common.error'), t('auth.passwordMinLength'));
      return;
    }

    setLoading(true);
    const result = await registerUser(email, password, userName, fullName);
    setLoading(false);

    if (!result.success) {
      Alert.alert(t('auth.registrationFailed'), result.error ?? t('common.unknownError'));
    }
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
          <Title color={COLORS.background}>{t('auth.signUp')}</Title>
          <TextInput
            placeholder={t('auth.userName')}
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
          />
          <TextInput
            placeholder={t('auth.fullName')}
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            placeholder={t('auth.email')}
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            placeholder={t('auth.password')}
            placeholderTextColor="#fff"
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          <TextInput
            placeholder={t('auth.repeatPassword')}
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
            <Text style={styles.buttonText}>{loading ? t('common.loading') : t('common.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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

export default SignUpScreen;
