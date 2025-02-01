import React from "react";
import { View, StyleSheet } from "react-native";
import StackNavigator from "./StackNavigator";

export default function App() {
  return <StackNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
});
