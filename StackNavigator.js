import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login_screen from "./Screens/Login_screen";
import RegisterScreen from "./Screens/Register_screen";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
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
        {/* <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Friends" component={FriendsScreen} />

        <Stack.Screen name="Chats" component={ChatsScreen} />

        <Stack.Screen name="Messages" component={ChatMessagesScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
