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
  Dimensions,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Mail, Lock, User, ArrowLeft, ArrowRight, ChefHat, Eye, EyeOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // In a real app, you'd register here
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('@/assets/images/truffle_beef_burger_1773798604806.png')} 
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
              >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <ArrowLeft size={24} color="white" />
                </TouchableOpacity>

                <View style={styles.header}>
                  <View style={[styles.logoContainer, { backgroundColor: theme.tint }]}>
                    <ChefHat size={40} color="white" />
                  </View>
                  <Text style={styles.welcomeText}>Join SmartChef</Text>
                  <Text style={styles.subtitleText}>Create an account to explore thousands of recipes</Text>
                </View>

                <View style={styles.form}>
                  <View style={[styles.inputContainer, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.2)' }]}>
                    <User size={20} color="white" style={styles.inputIcon} />
                    <TextInput
                      placeholder="Full Name"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      style={styles.input}
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>

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

                  <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                      By signing up, you agree to our{' '}
                      <Text style={[styles.termsLink, { color: theme.tint }]}>Terms of Service</Text>
                      {' '}and{' '}
                      <Text style={[styles.termsLink, { color: theme.tint }]}>Privacy Policy</Text>
                    </Text>
                  </View>

                  <TouchableOpacity 
                    style={[styles.loginButton, { backgroundColor: theme.tint }]}
                    onPress={handleRegister}
                  >
                    <Text style={styles.loginButtonText}>Sign Up</Text>
                    <ArrowRight size={20} color="white" />
                  </TouchableOpacity>

                  <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/Auth/login')}>
                      <Text style={[styles.signUpText, { color: theme.tint }]}>Sign In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  termsContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: '700',
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
