import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_URL } from "../data/ApiUrl";

const { width } = Dimensions.get("window");

// Card width adjustments
const cardWidth = Platform.OS === "web" ? width * 0.2 : width * 0.7;
const cardHeight = 100;

const Dashboard = () => {
  const [Agents, setAgents] = useState("");
  const [Experts, setExperts] = useState("");
  const [Customers, setCustomers] = useState("");
  const [Properties, setProperties] = useState("");
  const [SkilledResource, setSkilledResource] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/count/total-agents`)
      .then((response) => response.json())
      .then((data) => setAgents(data.totalAgents))
      .catch((error) => console.error("Error fetching total agents:", error));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/count/total-customers`)
      .then((response) => response.json())
      .then((data) => setCustomers(data.totalAgents))
      .catch((error) =>
        console.error("Error fetching total customers:", error)
      );
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/count/total-properties`)
      .then((response) => response.json())
      .then((data) => setProperties(data.totalAgents))
      .catch((error) =>
        console.error("Error fetching total properties:", error)
      );
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/count/total-experts`)
      .then((response) => response.json())
      .then((data) => setExperts(data.totalAgents))
      .catch((error) => console.error("Error fetching total experts:", error));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/count/total-skilledlabours`)
      .then((response) => response.json())
      .then((data) => setSkilledResource(data.totalAgents))
      .catch((error) =>
        console.error("Error fetching total skilled resources:", error)
      );
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = [
          {
            id: 1,
            title: "Wealth Associates",
            count: `${Agents}` || 2000,
            icon: "account-circle",
          },
          {
            id: 2,
            title: "Expert Panel Members",
            count: `${Experts}` || 2000,
            icon: "account-check",
          },
          {
            id: 3,
            title: "Investors & Landlords",
            count: "125",
            icon: "airplane",
          },
          {
            id: 4,
            title: "Customers",
            count: `${Customers}` || 2000,
            icon: "account-group",
          },
          {
            id: 5,
            title: "Total Properties Listed",
            count: `${Properties}` || 2000,
            icon: "office-building",
          },
          {
            id: 6,
            title: "Skilled Resource",
            count: `${SkilledResource}` || 2000,
            icon: "human-handsup",
          },
          { id: 7, title: "Core Clients", count: "12", icon: "contacts" },
          {
            id: 8,
            title: "Core Projects",
            count: "2,450",
            icon: "human-handsup",
          },
          {
            id: 9,
            title: "Channel Partners",
            count: "2,450",
            icon: "account-group",
          },
        ];
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [Agents, Experts, Customers, Properties, SkilledResource]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={
          Platform.OS === "web"
            ? styles.webGridContainer
            : styles.mobileContainer
        }
      >
        {data.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            count={item.count}
            icon={item.icon}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const DashboardCard = ({ title, count, icon }) => (
  <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.count}>{count}</Text>
    <Icon name={icon} size={30} color="#E91E63" style={styles.icon} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
    height: "90vh",
  },
  webGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    width: "85%",
    gap: 15,
  },
  mobileContainer: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    marginVertical: 6,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: "space-between",
    alignSelf: "center",
  },
  title: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  count: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  icon: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
});

export default Dashboard;
