import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login_screen from "./Screens/Login_screen";
import RegisterScreen from "./Screens/Register_screen";
import Admin_panel from "./Screens/Admin_panel";
import ForgotPassword from "./Screens/ForgetPassword";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="Login"
          component={Login_screen}
          options={{ headerShown: false }}
        /> */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
