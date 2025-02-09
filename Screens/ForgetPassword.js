import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";

export default function ForgotPassword() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View
          style={
            Platform.OS === "web"
              ? styles.webContentContainer
              : styles.contentContainer
          }
        >
          {/* Illustration */}
          <Image
            source={require("../assets/forgot_password.png")}
            style={styles.illustration}
            resizeMode="contain"
          />

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Forgot Password</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="Ex: 9063392872"
              />
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.getOtpButton}>
                <Text style={styles.getOtpButtonText}>Get OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 800,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    elevation: 5,
    height: "80%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 80,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  webContentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  illustration: {
    width: Platform.OS === "web" ? 350 : 300,
    height: Platform.OS === "web" ? 400 : 200,
    marginBottom: Platform.OS === "web" ? 0 : 16,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    height: "auto",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 16,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f8f9fa",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  getOtpButton: {
    backgroundColor: "#ee3b7b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  getOtpButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#ced4da",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#495057",
    fontWeight: "600",
  },
});
