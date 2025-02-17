import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login_screen from "./Screens/Login_screen";
import RegisterScreen from "./Screens/Register_screen";
import Admin_panel from "./Screens/Admin_panel";
import ForgotPassword from "./Screens/ForgetPassword";
import OTPVerification from "./Screens/OtpVerification";
import New_Password from "./Screens/New_Password";
import AdminDashboard from "./Admin_Pan/AdminDashboard";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="Login"
          component={Login_screen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Home"
          component={AdminDashboard}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
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
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
