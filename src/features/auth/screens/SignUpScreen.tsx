import { FONTS } from '@/constants/theme';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import ReturnHeaderButton from '@/shared/components/ReturnHeaderButton';
import Title from '@/shared/components/Title';
import { useColors } from '@/shared/hooks/useColors';
import SignUpBG from '@/shared/icons/signUpBG';
import type { AuthStackParamList } from '@/types/navigation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerUser } from '../services/authService';
import { addBreadcrumb } from '@/lib/sentry';
import { log } from '@/lib/logger';
import { useAppAlertModal } from '@/shared/hooks/useAppAlertModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const { showInfo, modal } = useAppAlertModal();
  const [userName, setUserName] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    log.debug('SignUpScreen mounted');
    return () => {
      log.debug('SignUpScreen unmounted');
    };
  }, []);

  const handleSignUp = async () => {
    if (!userName || !fullName || !email || !password || !confirmPassword) {
      log.warn('Sign up attempt with empty fields');
      showInfo({ title: t('common.error'), message: t('auth.fillAllFields'), confirmText: t('common.close') });
      return;
    }

    if (password !== confirmPassword) {
      log.warn('Password mismatch on sign up');
      showInfo({ title: t('common.error'), message: t('auth.passwordsNoMatch'), confirmText: t('common.close') });
      return;
    }

    if (password.length < 6) {
      log.warn('Password too short on sign up');
      showInfo({ title: t('common.error'), message: t('auth.passwordMinLength'), confirmText: t('common.close') });
      return;
    }

    log.info('User attempting registration', { email, userName });
    addBreadcrumb({
      message: 'User attempting registration',
      category: 'auth',
      data: { email, userName },
    });

    setLoading(true);
    const result = await registerUser(email, password, userName, fullName);
    setLoading(false);

    if (!result.success) {
      log.warn('Registration failed', { email, userName, error: result.error });
      showInfo({
        title: t('auth.registrationFailed'),
        message: result.error ?? t('common.unknownError'),
        confirmText: t('common.close'),
      });
    } else {
      log.info('Registration successful, user created', { userId: result.user?.uid, email });
      addBreadcrumb({
        message: 'User registered successfully',
        category: 'auth',
        level: 'info',
      });
    }
  };

  const handleGoBack = () => {
    log.debug('User tapped back button on sign up');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.wrapper, { backgroundColor: colors.primary }]} edges={['top']}>
      <SignUpBG style={styles.background} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ReturnHeaderButton style={styles.returnButton} onPress={handleGoBack} />

          <View style={styles.container}>
            <Title color="#FFFFFF">{t('auth.signUp')}</Title>

            <View style={styles.formContainer}>
              <TextInput
                placeholder={t('auth.userName')}
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={[styles.textInput, { color: '#FFFFFF' }]}
                value={userName}
                onChangeText={setUserName}
                autoCapitalize="none"
              />
              <TextInput
                placeholder={t('auth.fullName')}
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={[styles.textInput, { color: '#FFFFFF' }]}
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                placeholder={t('auth.email')}
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={[styles.textInput, { color: '#FFFFFF' }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                placeholder={t('auth.password')}
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={[styles.textInput, { color: '#FFFFFF' }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <TextInput
                placeholder={t('auth.repeatPassword')}
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={[styles.textInput, { color: '#FFFFFF' }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <AnimatedPressable
                style={[styles.confirmBtn, { backgroundColor: '#FFFFFF' }]}
                onPress={handleSignUp}
                disabled={loading}
                scaleValue={0.96}
              >
                <Text style={[styles.buttonText, { color: colors.primary }]}>
                  {loading ? t('common.loading') : t('common.confirm')}
                </Text>
              </AnimatedPressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {modal}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT * 0.9,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  returnButton: {
    marginTop: 10,
    marginLeft: 20,
    zIndex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  textInput: {
    width: '85%',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  confirmBtn: {
    minHeight: 50,
    borderRadius: 25,
    paddingHorizontal: 60,
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default SignUpScreen;
