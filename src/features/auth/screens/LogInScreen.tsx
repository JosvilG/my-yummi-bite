import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Title from '@/shared/components/Title';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import LogInBackground from '@/shared/icons/loginBG';
import { loginUser } from '../services/authService';
import { COLORS, FONTS } from '@/constants/theme';
import type { AuthStackParamList } from '@/types/navigation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type LogInScreenProps = NativeStackScreenProps<AuthStackParamList, 'LogIn'>;

const LogInScreen: React.FC<LogInScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', t('auth.fillAllFields'));
      return;
    }

    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert(t('common.error'), result.error ?? t('common.unknownError'));
    }
  };

  return (
    <View style={styles.wrapper}>
      <LogInBackground style={styles.background} />
      
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Title color={COLORS.background}>My Yummi Bite</Title>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                placeholder={t('auth.email')}
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                placeholder={t('auth.password')}
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              
              <AnimatedPressable
                style={styles.confirmBtn}
                onPress={handleLogIn}
                disabled={loading}
                scaleValue={0.96}
              >
                <Text style={styles.buttonText}>
                  {loading ? t('common.loading') : t('common.confirm')}
                </Text>
              </AnimatedPressable>

              <AnimatedPressable style={styles.forgotPassword} scaleValue={0.96}>
                <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
              </AnimatedPressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.noAccountText}>{t('auth.noAccount')}</Text>
            <AnimatedPressable onPress={() => navigation.navigate('SignUp')} scaleValue={0.96}>
              <Text style={styles.registerText}> {t('auth.signUp')}</Text>
            </AnimatedPressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    color: COLORS.background,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 4,
    paddingVertical: 14,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  confirmBtn: {
    backgroundColor: COLORS.background,
    minHeight: 50,
    borderRadius: 25,
    paddingHorizontal: 60,
    justifyContent: 'center',
    marginTop: 24,
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
    color: COLORS.primary,
  },
  forgotPassword: {
    marginTop: 20,
    padding: 8,
  },
  forgotPasswordText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.background,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 32,
  },
  noAccountText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
  },
  registerText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.background,
  },
});

export default LogInScreen;
