import React from "react";
import { View, StyleSheet } from "react-native";
import LoginScreen from "./Screens/Login_screen"; // Ensure correct file path
import RegisterScreen from "./Screens/Register_screen";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <LoginScreen /> */}
      <RegisterScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
});
