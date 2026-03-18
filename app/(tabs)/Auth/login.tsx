import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Mail, Lock, ArrowRight, ChefHat, Eye, EyeOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '@/lib/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { LoginSchema } from '@/schemas/login.schema';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // 1. Validate against schema
    const validation = LoginSchema.safeParse({ email, password });
    
    if (!validation.success) {
      const firstError = validation.error.issues[0].message;
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: firstError,
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'Successfully signed in.',
        position: 'top',
        topOffset: 60,
      });
      router.replace('/');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message,
        position: 'top',
        topOffset: 60,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('@/assets/images/mediterranean_salmon_1773798250272.png')} 
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.content}
            >
              <View style={styles.header}>
                <View style={[styles.logoContainer, { backgroundColor: theme.tint }]}>
                  <ChefHat size={40} color="white" />
                </View>
                <Text style={styles.welcomeText}>Welcome Back!</Text>
                <Text style={styles.subtitleText}>Sign in to continue your culinary journey</Text>
              </View>

              <View style={styles.form}>
                <View style={[styles.inputContainer, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.2)' }]}>
                  <Mail size={20} color="white" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Email Address"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={[styles.inputContainer, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.2)' }]}>
                  <Lock size={20} color="white" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} color="white" /> : <Eye size={20} color="white" />}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.loginButton, { backgroundColor: theme.tint }]}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <ArrowRight size={20} color="white" />
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => router.push('/Auth/register')}>
                    <Text style={[styles.signUpText, { color: theme.tint }]}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
  },
  signUpText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
