import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Title from '@/shared/components/Title';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import SignUpBG from '@/shared/icons/signUpBG';
import ReturnHeaderButton from '@/shared/components/ReturnHeaderButton';
import { registerUser } from '../services/authService';
import { COLORS, FONTS } from '@/constants/theme';
import type { AuthStackParamList } from '@/types/navigation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    <SafeAreaView style={styles.wrapper} edges={['top']}>
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
          <ReturnHeaderButton style={styles.returnButton} onPress={() => navigation.goBack()} />
          
          <View style={styles.container}>
            <Title color={COLORS.background}>{t('auth.signUp')}</Title>
            
            <View style={styles.formContainer}>
              <TextInput
                placeholder={t('auth.userName')}
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.textInput}
                value={userName}
                onChangeText={setUserName}
                autoCapitalize="none"
              />
              <TextInput
                placeholder={t('auth.fullName')}
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
              />
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
              <TextInput
                placeholder={t('auth.repeatPassword')}
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              
              <AnimatedPressable
                style={styles.confirmBtn}
                onPress={handleSignUp}
                disabled={loading}
                scaleValue={0.96}
              >
                <Text style={styles.buttonText}>
                  {loading ? t('common.loading') : t('common.confirm')}
                </Text>
              </AnimatedPressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.primary,
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
    color: COLORS.background,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  confirmBtn: {
    backgroundColor: COLORS.background,
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
    color: COLORS.primary,
  },
});

export default SignUpScreen;
