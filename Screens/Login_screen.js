import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function Login_screen() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Render the left section only if the platform is not Android */}
        {Platform.OS !== "android" && (
          <View style={styles.leftSection}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Your Trusted Property Consultant</Text>
          </View>
        )}

        <View
          style={[
            styles.rightSection,
            Platform.OS === "android" ? { flex: 1 } : null,
          ]}
        >
          <Image
            source={
              Platform.OS === "android"
                ? require("../assets/logo.png")
                : require("../assets/logo2.png")
            }
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text style={styles.welcomeText}>
            Welcome back! Log in to your account.
          </Text>

          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ex. 9063392872"
              placeholderTextColor="rgba(25, 25, 25, 0.5)"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
            />
            <Icon
              name="call-outline"
              size={20}
              color="red"
              style={styles.icon}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="rgba(25, 25, 25, 0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Icon
              name="lock-closed-outline"
              size={20}
              color="red"
              style={styles.icon}
            />
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot your Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.signupText}>
              Don't have an account?{" "}
              <Text style={styles.signupLink}>Sign up here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "90%",
    maxWidth: 980,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: "row",
    padding: 20,
  },
  leftSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 20,
  },
  rightSection: {
    flex: 1,
    paddingLeft: 20,
  },
  logo: {
    width: 247,
    height: 169,
  },
  tagline: {
    marginTop: 20,
    fontFamily: "Cairo",
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
  },
  illustration: {
    width: 144,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontFamily: "Cairo",
    fontSize: 16,
    color: "#E82E5F",
    marginBottom: 20,
  },
  label: {
    fontFamily: "Cairo",
    fontSize: 16,
    color: "#191919",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    fontFamily: "Cairo",
    fontSize: 16,
    padding: 15,
    height: 47,
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  actionContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: "#E82E5F",
    borderRadius: 15,
    width: 100,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontFamily: "Cairo",
    fontSize: 16,
  },
  forgotPassword: {
    color: "#E82E5F",
    fontFamily: "Cairo",
    fontSize: 16,
  },
  signupContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  signupText: {
    fontFamily: "Cairo",
    fontSize: 16,
    color: "#191919",
  },
  signupLink: {
    color: "#E82E5F",
  },
});
