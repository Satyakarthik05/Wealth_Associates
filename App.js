import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Alert,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Updates from 'expo-updates';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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
import CallCenterLogin from "./CallCenterDash/Login_screen";
import New_Password from "./Screens/New_Password";
import { API_URL } from "./data/ApiUrl";
import NriRegister from "./Screens/AddNri";
import InvestorRegister from "./Screens/AddInvestors";
import SkilledRegister from "./Screens/Rskill";
import { NavigationIndependentTree } from "@react-navigation/native";
import { Newspaper } from "lucide-react-native";
import { Linking } from "react-native";
import * as Updates from "expo-updates";

const Stack = createStackNavigator();
const APP_VERSION = "1.0.1";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Main Screen");

  // Handle notifications when app is in foreground
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        // You can add custom handling here if needed
      }
    );

    return () => subscription.remove();
  }, []);

  // Handle notification taps when app is in background/quit
  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification tapped:", response.notification);
        // Handle navigation based on notification if needed
      });

    return () => responseListener.remove();
  }, []);
  const linking = {
    prefixes: ["https://www.wealthassociate.in"],
    config: {
      screens: {
        "Main Screen": "",
        PrivacyPolicy: "privacy_policy",
      },
    },
  };

  useEffect(() => {
    async function checkForUpdates() {
      try {
        if (!__DEV__) {
          // Only check in production
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            Alert.alert(
              "Update Available",
              "A new version of the app is available. Restart to apply the update.",
              [
                {
                  text: "Restart Now",
                  onPress: async () => {
                    await Updates.reloadAsync();
                  },
                },
              ]
            );
          }
        }
      } catch (error) {
        console.log("Error checking for updates:", error);
      }
    }

    checkForUpdates();
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedVersion = await AsyncStorage.getItem("appVersion");
        if (storedVersion !== APP_VERSION) {
          console.log("New version detected, clearing authToken...");
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.setItem("appVersion", APP_VERSION);
        }

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

        // Setup push notifications
        await setupPushNotifications();
      } catch (error) {
        console.error("Error during app initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        // Check if an update is available
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          // Download the update
          await Updates.fetchUpdateAsync();
          // Apply the update and reload the app
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log('Error checking for updates:', error);
      }
    }

    // Run the update check when the app mounts
    checkForUpdates();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer
        linking={Platform.OS === "web" ? linking : undefined}
      >
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
          <Stack.Screen
            name="CallCenterLogin"
            component={CallCenterLogin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="nrireg"
            component={NriRegister}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="invreg"
            component={InvestorRegister}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="skillreg"
            component={SkilledRegister}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

async function setupPushNotifications() {
  try {
    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications");
      return;
    }

    // Check or request permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permission required", "Push notifications need permission");
      return;
    }

    // Get the push token
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "38b6a11f-476f-46f4-8263-95fe96a6d8ca",
      })
    ).data;

    console.log("Expo Push Token:", token);
    await AsyncStorage.setItem("expoPushToken", token);

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default Channel",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
      });
    }

    try {
      await fetch(`${API_URL}/noti/register-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      console.log("Couldn't send token to backend:", error);
    }
  } catch (error) {
    console.error("Error setting up notifications:", error);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
});
