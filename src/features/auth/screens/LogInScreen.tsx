import { FONTS } from '@/constants/theme';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import Title from '@/shared/components/Title';
import { useColors } from '@/shared/hooks/useColors';
import LogInBackground from '@/shared/icons/loginBG';
import type { AuthStackParamList } from '@/types/navigation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser } from '../services/authService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type LogInScreenProps = NativeStackScreenProps<AuthStackParamList, 'LogIn'>;

const LogInScreen: React.FC<LogInScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
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
    <View style={[styles.wrapper, { backgroundColor: colors.primary }]}>
      <LogInBackground style={styles.background} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Title color={'#FFFFFF'}>My Yummi Bite</Title>
            </View>

            <View style={styles.formContainer}>
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

              <AnimatedPressable
                style={[styles.confirmBtn, { backgroundColor: '#FFFFFF' }]}
                onPress={handleLogIn}
                disabled={loading}
                scaleValue={0.96}
              >
                <Text style={[styles.buttonText, { color: colors.primary }]}>
                  {loading ? t('common.loading') : t('common.confirm')}
                </Text>
              </AnimatedPressable>

              <AnimatedPressable style={styles.forgotPassword} scaleValue={0.96}>
                <Text style={[styles.forgotPasswordText, { color: '#FFFFFF' }]}>
                  {t('auth.forgotPassword')}
                </Text>
              </AnimatedPressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.noAccountText, { color: 'rgba(255,255,255,0.8)' }]}>
              {t('auth.noAccount')}
            </Text>
            <AnimatedPressable onPress={() => navigation.navigate('SignUp')} scaleValue={0.96}>
              <Text style={[styles.registerText, { color: '#FFFFFF' }]}> {t('auth.signUp')}</Text>
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
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 4,
    paddingVertical: 14,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  confirmBtn: {
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
  },
  forgotPassword: {
    marginTop: 20,
    padding: 8,
  },
  forgotPasswordText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
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
  },
  registerText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
});

export default LogInScreen;
