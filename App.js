import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainScreen from "./Screens/MainScreen";
import RegisterAsScreen from "./Screens/Register_change";
import ForgotPassword from "./Screens/ForgetPassword";
import OTPVerification from "./Screens/OtpVerification";
import RegisterScreen from "./Screens/Register_screen";
import RegisterCustomer from "./Screens/Customer_Register";
import Login_screen from "./Screens/Login_screen";
import Admin_panel from "./Screens/Admin_panel";
import CustomerDashboard from "./CustomerDashboard/CustomerDashboard";
import CoreDashboard from "./CoreDashboard/CoreDashboard";
import RLogin_screen from "./Refferal/Screens/Login_screen";
import PrivacyPolicy from "./Screens/PrivacyPolicy";
import Admin from "./Admin_Pan/AdminDashboard";
import SkillDasboard from "./SkillDashboard/SkillDashboard";
import NriDashboard from "./NriDashboard/NriDashboard";
import InvestorDashboard from "./InvestorDashboard/InvestorDashboard";
import { NavigationIndependentTree } from "@react-navigation/native";
import StartingScreen from "./StartingScreen";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Main Screen");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const userType = await AsyncStorage.getItem("userType");

        if (token && userType) {
          switch (userType) {
            case "WealthAssociate":
              setInitialRoute("Home");
              break;
            case "Customer":
              setInitialRoute("CustomerDashboard");
              break;
            case "Investor":
              setInitialRoute("InvestorDashboard");
              break;
            case "Coremember":
              setInitialRoute("CoreDashboard");
              break;
            case "Referral":
              setInitialRoute("Home");
              break;
            case "SkilledLabour":
              setInitialRoute("SkillDashboard");
              break;
            case "Nri":
              setInitialRoute("NriDashboard");
              break;
            default:
              setInitialRoute("Main Screen");
          }
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

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
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Main Screen"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterAS"
            component={RegisterAsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Starting Screen"
            component={StartingScreen}
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
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterCustomer"
            component={RegisterCustomer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login_screen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Admin_panel}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CustomerDashboard"
            component={CustomerDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CoreDashboard"
            component={CoreDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RefferalDashboard"
            component={RLogin_screen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Admin"
            component={Admin}
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
