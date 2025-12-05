// src/screens/LoginPage.js
import React, { useContext, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AuthContext = React.createContext(null); // Define context to use AuthContext

const LoginPage = ({ navigation }) => {
  const { signIn } = useContext(AuthContext); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // ⚠️ TODO: Replace this placeholder logic with real API authentication check
    if (email === 'user' && password === '1234') {
      signIn(); // Transition to the dashboard
    } else {
      Alert.alert("Login Failed", "Invalid credentials. Use user/1234 for testing.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>VitalTrack</Text>
        <View style={styles.logoPlaceholder}><Text style={{ color: '#fff' }}>(logo)</Text></View>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username / Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.linkButton} onPress={() => Alert.alert('Forgot Password')}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => Alert.alert('Register')}>
        <Text style={styles.linkText}>Don't have an account? <Text style={styles.registerLink}>Register</Text></Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// ... (Styles for LoginPage)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBEBEB', // Light pink background
    alignItems: 'center',
    paddingTop: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  logoPlaceholder: {
    width: 100,
    height: 50,
    backgroundColor: '#C5B4B4',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  form: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFECF0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFECF0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  linkButton: {
    marginTop: 20,
  },
  registerButton: {
    position: 'absolute',
    bottom: 30,
  },
  linkText: {
    color: '#333',
    fontSize: 14,
  },
  registerLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});

export default LoginPage;