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
import { NavigationIndependentTree } from "@react-navigation/native";

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

  // Enhanced notification handling
  useEffect(() => {
    const initializeNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
      if (token) {
        await sendTokenToBackend(token);
      }
    };

    initializeNotifications();

    // Foreground notification handler
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received (foreground):", notification);
        // You can handle the notification here if needed
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
          Linking.openURL(data.url);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
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

  useEffect(() => {
    async function checkForUpdates() {
      try {
        if (!__DEV__) {
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

async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission required",
        "Push notifications need permission to work properly",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return null;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "38b6a11f-476f-46f4-8263-95fe96a6d8ca",
      })
    ).data;

    console.log("Expo Push Token:", token);
    await AsyncStorage.setItem("expoPushToken", token);

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

    // Send a test notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notifications Enabled",
        body: "You will now receive important updates from WealthAssociate",
        data: { test: "notification_data" },
      },
      trigger: { seconds: 2 },
    });

    return token;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    return null;
  }
}

async function sendTokenToBackend(token) {
  try {
    const response = await fetch(`${API_URL}/noti/register-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        deviceId: Device.modelName || "unknown",
        platform: Platform.OS,
        osVersion: Platform.Version,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to register token");
    }

    console.log("Token successfully registered with backend");
  } catch (error) {
    console.error("Error sending token to backend:", error);
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
