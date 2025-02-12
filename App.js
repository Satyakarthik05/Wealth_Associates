import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // Use createStackNavigator instead
import Login_screen from "./Screens/Login_screen";
import RegisterScreen from "./Screens/Register_screen";
import Admin_panel from "./Screens/Admin_panel";
import ForgotPassword from "./Screens/ForgetPassword";
import OTPVerification from "./Screens/OtpVerification";
import New_Password from "./Screens/New_Password";

const Stack = createStackNavigator(); // Use createStackNavigator instead of createNativeStackNavigator

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login_screen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Admin_panel}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Forgetpassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="otpscreen"
          component={OTPVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="newpassword"
          component={New_Password}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
