import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { setIsLoggedIn } from './auth';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Error and attempt state
  const [showError, setShowError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Forgot Password modal state
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Forced forgot password modal after 4 failed attempts
  const [forceForgotModal, setForceForgotModal] = useState(false);
  const [forceResetEmail, setForceResetEmail] = useState('');
  const [forceEmailSent, setForceEmailSent] = useState(false);

  //temporary credentials for demonstration purposes
  const TEMP_USERNAME = 'admin';
  const TEMP_PASSWORD = 'admin';

  const handleLogin = async () => {
    if (!username || !password) {
      setShowError(true);
      return;
    }
    setLoading(true);
    try {
      if (username === TEMP_USERNAME && password === TEMP_PASSWORD) {
        setShowError(false);
        setAttempts(0);
        await setIsLoggedIn(true);
        router.replace('/home');
      } else {
        setShowError(true);
        setAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts >= 4) {
            setForceForgotModal(true);
          }
          return newAttempts;
        });
      }
    } catch (error) {
      console.error("Error during login process:", error);
      Alert.alert('Login Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Normal forgot password modal handlers
  const handleSendReset = () => {
    setEmailSent(true);
    // Here you would trigger your password reset logic (API call)
  };

  const handleCloseModal = () => {
    setForgotModalVisible(false);
    setResetEmail('');
    setEmailSent(false);
  };

  // Forced forgot password modal handlers (after 4 failed attempts)
  const handleForceSendReset = () => {
    setForceEmailSent(true);
    // Here you would trigger your password reset logic (API call)
  };

  const handleForceCloseModal = () => {
    setForceForgotModal(false);
    setForceResetEmail('');
    setForceEmailSent(false);
    setAttempts(0);
    setShowError(false);
  };

  const handleTryAgain = () => {
    setForceForgotModal(false);
    setForceResetEmail('');
    setForceEmailSent(false);
    setAttempts(0);
    setShowError(false);
  };

  return (
    <View style={styles.container}>
      {/* Error prompt above username */}
      {showError && attempts < 4 && (
        <View style={styles.errorBox}>
          <Text style={styles.errorHeader}>Error</Text>
          <Text style={styles.errorText}>Please enter a valid username/password to sign in</Text>
        </View>
      )}

      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        autoCapitalize="none"
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button
        title={loading ? "Logging In..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
      {loading && <ActivityIndicator size="small" color="#0000ff" style={styles.activityIndicator} />}

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={() => setForgotModalVisible(true)} style={styles.forgotLink}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Normal Forgot Password Modal */}
      <Modal
        visible={forgotModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!emailSent ? (
              <>
                <Text style={styles.modalTitle}>Reset Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                />
                <Button
                  title="Send"
                  onPress={handleSendReset}
                  disabled={!resetEmail}
                />
                <Button title="Cancel" onPress={handleCloseModal} color="gray" />
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Check your email</Text>
                <Text style={styles.modalMessage}>
                  An email has been sent to reset your password.
                </Text>
                <Button title="Close" onPress={handleCloseModal} />
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Forced Forgot Password Modal after 4 failed attempts */}
      <Modal
        visible={forceForgotModal}
        transparent
        animationType="slide"
        onRequestClose={handleForceCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!forceEmailSent ? (
              <>
                <Text style={styles.modalTitle}>Forgotten Password?</Text>
                <Text style={styles.modalMessage}>
                  Enter your email address below to reset password.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={forceResetEmail}
                  onChangeText={setForceResetEmail}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <View style={{ flex: 1, marginRight: 5 }}>
                    <Button
                      title="Continue"
                      onPress={handleForceSendReset}
                      disabled={!forceResetEmail}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 5 }}>
                    <Button
                      title="Try Again"
                      onPress={handleTryAgain}
                      color="gray"
                    />
                  </View>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Check your email</Text>
                <Text style={styles.modalMessage}>
                  An email has been sent to reset your password.
                </Text>
                <Button title="Close" onPress={handleForceCloseModal} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  activityIndicator: {
    marginTop: 10,
  },
  forgotLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotText: {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'stretch',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#ffe6e6',
    borderColor: '#ff4d4d',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  errorHeader: {
    color: '#b30000',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  errorText: {
    color: '#b30000',
    fontSize: 14,
  },
});
