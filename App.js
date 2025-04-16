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
import { Linking } from "react-native";
import * as Updates from "expo-updates";
import Constants from "expo-constants";
import { NavigationIndependentTree } from "@react-navigation/native";

// Screens (import all your screens here)
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

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();
const APP_VERSION = "1.0.1";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Main Screen");
  const [expoPushToken, setExpoPushToken] = useState("");

  // Enhanced notification handling with Firebase support
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setExpoPushToken(token);
          await sendTokenToBackend(token, Platform.OS);
          await AsyncStorage.setItem("expoPushToken", token);
        }
      } catch (error) {
        console.error("Notification initialization error:", error);
      }
    };

    initializeNotifications();

    // Handle token refreshes
    const tokenRefreshSubscription = Notifications.addPushTokenListener(
      async (newToken) => {
        console.log("Token refreshed:", newToken);
        setExpoPushToken(newToken.data);
        await sendTokenToBackend(newToken.data, Platform.OS);
        await AsyncStorage.setItem("expoPushToken", newToken.data);
      }
    );

    // Foreground notification handler
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received (foreground):", notification);
        // Show alert for foreground notifications
        Alert.alert(
          notification.request.content.title || "Notification",
          notification.request.content.body
        );
      }
    );

    // Background/quit notification handler
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "Notification tapped (background/quit):",
          response.notification
        );
        // Handle navigation based on notification
        const data = response.notification.request.content.data;
        if (data?.url) {
          Linking.canOpenURL(data.url).then((supported) => {
            if (supported) Linking.openURL(data.url);
          });
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
      tokenRefreshSubscription.remove();
    };
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

  // App initialization and update checks
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for updates
        if (!__DEV__) {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            Alert.alert(
              "Update Available",
              "A new version is available. Restart to update.",
              [
                {
                  text: "Restart Now",
                  onPress: async () => await Updates.reloadAsync(),
                },
              ]
            );
          }
        }

        // Check version and auth status
        const storedVersion = await AsyncStorage.getItem("appVersion");
        if (storedVersion !== APP_VERSION) {
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.setItem("appVersion", APP_VERSION);
        }

        const token = await AsyncStorage.getItem("authToken");
        const userType = await AsyncStorage.getItem("userType");

        if (token && userType) {
          // Set initial route based on user type
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
            case "Call center":
              setInitialRoute("CallCenterDashboard");
              break;
            default:
              setInitialRoute("Main Screen");
          }
        }
      } catch (error) {
        console.error("App initialization error:", error);
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
      <NavigationContainer
        linking={Platform.OS === "web" ? linking : undefined}
      >
        <Stack.Navigator initialRouteName={initialRoute}>
          {/* All your screen components */}
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

// Enhanced push notification registration with Firebase support
async function registerForPushNotificationsAsync() {
  try {
    // Check if running on a physical device
    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications");
      return null;
    }

    // Get current permission status
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not already granted
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If permission still not granted, show alert
    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission required",
        "Push notifications need permission to work properly",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return null;
    }

    // Get the Expo push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.error("Project ID not found in app config");
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
      .data;
    console.log("Expo Push Token:", token);

    // Android-specific configuration
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
        showBadge: true,
      });
    }

    // Send test notification to verify setup
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notifications Enabled",
        body: "You will now receive important updates",
        data: { test: "notification_data" },
      },
      trigger: { seconds: 2 },
    });

    return token;
  } catch (error) {
    console.error("Push notification registration error:", error);
    return null;
  }
}

// Send token to backend with device type information
async function sendTokenToBackend(token, deviceType) {
  try {
    const userId = await AsyncStorage.getItem("userId"); // If you have user auth
    const appVersion = Constants.expoConfig.version || APP_VERSION;

    const response = await fetch(`${API_URL}/noti/register-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        token,
        deviceType,
        appVersion,
        userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to register token: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Token registration successful:", data);
    return true;
  } catch (error) {
    console.error("Error sending token to backend:", error.message);
    return false;
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
