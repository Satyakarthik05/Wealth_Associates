import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import Loginas from "./Screens/Loginas";
import Login_screen from "./Screens/Login_screen";
import RegisterScreen from "./Screens/Register_screen";
import Admin_panel from "./Screens/Admin_panel";
import ForgotPassword from "./Screens/ForgetPassword";
import OTPVerification from "./Screens/OtpVerification";
import New_Password from "./Screens/New_Password";
import Agent_Profile from "./Screens/Agent/Agent_Profile";
import PrivacyPolicy from "./Screens/PrivacyPolicy";
import StartingScreen from "./StartingScreen";
import CustomerDashboard from "./CustomerDashboard/CustomerDashboard";
import { NavigationIndependentTree } from "@react-navigation/native";
import CoreDashboard from "./CoreDashboard/CoreDashboard";
import Admin from "./Admin_Pan/AdminDashboard";
import { StatusBar } from "expo-status-bar";
import MainScreen from "./Screens/MainScreen";
// import Admin_panelnri from "./Nri_Dashboard/Screens/Admin_panel";
// import NRILogin_screen from "./Nri_Dashboard/Screens/Login_Nri";
import RLogin_screen from "./Refferal/Screens/Login_screen";
import RegisterAsScreen from "./Screens/Register_change";
import RegisterCustomer from "./Screens/Customer_Register";
// import Login_Nri from "./Nri_Dashboard/Screens/Login_Nri";
// import Main_dashboard from "./Nri_Dashboard/Main_dashboard";
import SkillDasboard from "./SkillDashboard/SkillDashboard";
import NriDashboard from "./NriDashboard/NriDashboard";
import InvestorDashboard from "./InvestorDashboard/InvestorDashboard";
const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Track login state
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Check login status on app start
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken"); // Replace "userToken" with your key
        setIsLoggedIn(token !== null); // Set login state based on token presence
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    checkLoginStatus();
  }, []);

  // Show a loading indicator while checking login status
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main Screen"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Starting Screen"
            component={StartingScreen}
            options={{ headerShown: false }}
          />
          {isLoggedIn ? (
            // If logged in, show the Home screen
            <Stack.Screen
              name="Homes"
              component={Admin_panel}
              options={{ headerShown: false }}
            />
          ) : (
            // If not logged in, show the Login screen
            <Stack.Screen
              name="Logins"
              component={Login_screen}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="RegisterAS"
            component={RegisterAsScreen}
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
          {/* <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          /> */}
          {/* <Stack.Screen
            name="RegisterCustomer"
            component={RegisterCustomer}
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen
            name="Login"
            component={Login_screen}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="Home"
            component={Admin_panel}
            options={{ headerShown: false }}
          /> */}
          {/* <Stack.Screen
            name="CustomerDashboard"
            component={CustomerDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CoreDashboard"
            component={CoreDashboard}
            options={{ headerShown: false }}
          /> */}
          {/* <Stack.Screen
            name="RefferalDashboard"
            component={RLogin_screen}
            options={{ headerShown: false }}
          /> */}
          {/* <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{ headerShown: true }}
          /> */}
          {/* <Stack.Screen
            name="Admin"
            component={Admin}
            options={{ headerShown: false }}
          /> */}
          {/* <Stack.Screen
            name="ReferralDashboard"
            component={RLogin_screen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SkillDashboard"
            component={SkillDasboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NriDashboard"
            component={NriDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="InvestorDashboard"
            component={InvestorDashboard}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
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
