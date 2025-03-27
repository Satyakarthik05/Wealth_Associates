import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Dashboard = () => {
  const data = [
    { title: "Agents", value: "12,000", icon: "account" },
    { title: "Customers", value: "1,500", icon: "account-group" },
    { title: "Posted Properties", value: "125", icon: "office-building" },
    { title: "Expert Requests", value: "12,000", icon: "help-circle" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {data.slice(0, 3).map((item, index) => (
          <Card key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Title>{item.title}</Title>
                <Text style={styles.value}>{item.value}</Text>
              </View>
              <Icon name={item.icon} size={30} color="#D42A5E" />
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.row}>
        <Card style={[styles.card, styles.fullWidth]}>
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Title>Expert Requests</Title>
              <Text style={styles.value}>12,000</Text>
            </View>
          </View>
        </Card>
      </View>

      <Text style={styles.version}>Version : 1.0.0.0.2025</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#F8F8F8",
      alignItems: "center", // Center content
      width:"100%",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "90%", // Reduce overall row width
      marginBottom: 15,
    },
    card: {
      width: "30%", // Reduce card width
      padding: 15,
      backgroundColor: "white",
      elevation: 5,
      borderRadius: 10,
    },
    fullWidth: {
      width: "30%", // Expert Requests card will take full row width
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    textContainer: {
      flex: 1,
    },
    value: {
      fontSize: 22,
      fontWeight: "bold",
    },
    version: {
      textAlign: "right",
      marginTop: 10,
      color: "gray",
    },
  });
  

export default Dashboard;
