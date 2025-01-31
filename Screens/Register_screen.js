import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const RegisterScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.tagline}>Your Trusted Property Consultant</Text>
          <Text style={styles.title}>REGISTER AS AN AGENT</Text>

          <View
            style={
              Platform.OS === "web"
                ? styles.webInputWrapper
                : styles.mobileInputWrapper
            }
          >
            <View style={styles.inputContainer}>
              <View
                style={
                  Platform.OS === "web"
                    ? styles.webInputWrapper
                    : styles.mobileInputWrapper
                }
              >
                <View style={styles.input_label}>
                  <Text style={styles.label}>Fullname</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={
                        Platform.OS === "web" ? styles.webinput : styles.input
                      }
                      placeholder="Full name"
                      placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    />
                    <FontAwesome
                      name="user"
                      size={20}
                      color="gray"
                      style={styles.icon}
                    />
                  </View>
                </View>
                <View style={styles.input_label}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={
                        Platform.OS === "web" ? styles.webinput : styles.input
                      }
                      placeholder="Mobile Number"
                      placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    />
                    <MaterialIcons
                      name="phone"
                      size={20}
                      color="gray"
                      style={styles.icon}
                    />
                  </View>
                </View>
                <View style={styles.input_label}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={
                        Platform.OS === "web" ? styles.webinput : styles.input
                      }
                      placeholder="Email"
                      placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    />
                    <MaterialIcons
                      name="email"
                      size={20}
                      color="gray"
                      style={styles.icon}
                    />
                  </View>
                </View>
              </View>

              <View
                style={
                  Platform.OS === "web"
                    ? styles.webInputWrapper
                    : styles.mobileInputWrapper
                }
              >
                <View style={styles.input_label}>
                  <Text style={styles.label}>Select District</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={
                        Platform.OS === "web" ? styles.webinput : styles.input
                      }
                      placeholder="Select District"
                      placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    />
                    <FontAwesome
                      name="map"
                      size={20}
                      color="gray"
                      style={styles.icon}
                    />
                  </View>
                </View>
                <View style={styles.input_label}>
                  <Text style={styles.label}>Select Constituency</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={
                        Platform.OS === "web" ? styles.webinput : styles.input
                      }
                      placeholder="Select Constituency"
                      placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    />
                    <FontAwesome
                      name="map-pin"
                      size={20}
                      color="gray"
                      style={styles.icon}
                    />
                  </View>
                </View>
                <View style={styles.input_label}>
                  <Text style={styles.label}>Location</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={
                        Platform.OS === "web" ? styles.webinput : styles.input
                      }
                      placeholder="Location"
                      placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    />
                    <MaterialIcons
                      name="location-on"
                      size={20}
                      color="gray"
                      style={styles.icon}
                    />
                  </View>
                </View>
              </View>

              <View
                style={
                  Platform.OS === "web"
                    ? styles.webInputWrapper
                    : styles.mobileInputWrapper
                }
              >
                <View style={styles.input_label}>
                  <Text style={styles.label}>Select Expertise</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={
                        Platform.OS === "web" ? styles.webinput : styles.input
                      }
                      placeholder="Select Expertise"
                      placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    />
                    <FontAwesome
                      name="briefcase"
                      size={20}
                      color="gray"
                      style={styles.icon}
                    />
                  </View>
                </View>
                <View style={styles.input_label}>
                  <Text style={styles.label}>Select Experience</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={
                        Platform.OS === "web" ? styles.webinput : styles.input
                      }
                      placeholder="Select Experience"
                      placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    />
                    <FontAwesome
                      name="calendar"
                      size={20}
                      color="gray"
                      style={styles.icon}
                    />
                  </View>
                </View>
                <View style={styles.input_label}>
                  <Text style={styles.label}>Referral Code</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={
                        Platform.OS === "web" ? styles.webinput : styles.input
                      }
                      placeholder="Referral Code"
                      placeholderTextColor="rgba(25, 25, 25, 0.5)"
                    />
                    <MaterialIcons
                      name="card-giftcard"
                      size={20}
                      color="gray"
                      style={styles.icon}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Login here</Text>
          </Text>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  input_label: {
    display: "flex",
    flexDirection: "column",
  },
  inputWrapper: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 13,
  },
  webinput: {
    width: "250px",
    height: 47,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    width: Platform.OS === "web" ? "60%" : "90%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    width: "90%",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center",
    borderWidth: Platform.OS === "web" ? 0 : 1,
    borderColor: Platform.OS === "web" ? "transparent" : "#ccc",
  },
  logo: {
    width: 100,
    height: 70,
    resizeMode: "contain",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 9,
    color: "#000",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginTop: 10,
    marginBottom: 20,
  },
  webInputWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    marginTop: "20px",
  },
  mobileInputWrapper: {
    width: "100%",
  },
  inputContainer: {
    width: Platform.OS === "web" ? "30%" : "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#191919",
  },
  input: {
    width: "100%",
    height: 47,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: "#E82E5F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  cancelButton: {
    backgroundColor: "#424242",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "400",
  },
  loginText: {
    marginTop: 20,
    fontSize: 16,
    color: "#E82E5F",
  },
  loginLink: {
    fontWeight: "bold",
  },
});

export default RegisterScreen;
