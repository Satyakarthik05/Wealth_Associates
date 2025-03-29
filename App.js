import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, View, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Screens
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
import StartingScreen from "./StartingScreen";
import CallCenterDashboard from "./CallCenterDash/CallCenterDashboard";
import New_Password from "./Screens/New_Password";
import { API_URL } from "./data/ApiUrl";

// ✅ Keep NavigationIndependentTree
import { NavigationIndependentTree } from "@react-navigation/native";
import { Newspaper } from "lucide-react-native";

const Stack = createStackNavigator();
const APP_VERSION = "1.0.1"; // Change this when updating the app

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Main Screen");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if app version has changed
        const storedVersion = await AsyncStorage.getItem("appVersion");
        if (storedVersion !== APP_VERSION) {
          console.log("New version detected, clearing authToken...");
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.setItem("appVersion", APP_VERSION);
        }

        // Check login status
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
            case "CallCenter":
              setInitialRoute("CallCenterDashboard");
              break;
            case "Nri":
              setInitialRoute("NriDashboard");
              break;
            case "Admin":
              setInitialRoute("Admin");
              break;
            default:
              setInitialRoute("Main Screen");
          }
        }

        // Register for push notifications
        await registerForPushNotificationsAsync();
      } catch (error) {
        console.error("Error during app initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
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
          {/* <Stack.Screen
            name="LoginAS"
            component={login}
            options={{ headerShown: false }}
          /> */}
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
            name="newpassword"
            component={New_Password}
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
          <Stack.Screen
            name="CallCenterDashboard"
            component={CallCenterDashboard}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

// ✅ Push Notification Registration
async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      Alert.alert("Error", "Must use a physical device for push notifications");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Error", "Failed to get permission for notifications");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);

    if (token) {
      await AsyncStorage.setItem("expoPushToken", token);

      // Send token to backend
      await fetch(`${API_URL}/noti/register-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    }
  } catch (error) {
    console.error("Error registering for push notifications:", error);
  }
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
});
