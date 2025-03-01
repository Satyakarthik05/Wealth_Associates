import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ViewSkilledLabours() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://your-backend-url/agents")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAgents(data);
        } else {
          setAgents([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching agents:", error);
        setLoading(false);
      });
  }, []);

  // Two Sample Customers for reference
  const dummyAgents = [
    {
      id: "dummy1",
      name: "John Dhee",
      skill: "Painter",
      mobile: "9063392872",
      location: "Vijayawada",
      avatar: require("../Admin_Pan/assets/man.png"),
    },
    {
      id: "dummy2",
      name: "Jane Doe",
      skill: "Plumber",
      mobile: "7896541230",
      location: "Guntur",
      avatar: require("../Admin_Pan/assets/man.png"),
    },
  ];

  const renderAgentCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>: {item.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Skill Type</Text>
          <Text style={styles.value}>: {item.skill}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile Number</Text>
          <Text style={styles.value}>: {item.mobile}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>: {item.location}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Skilled labours</Text>
      <FlatList
        data={loading ? dummyAgents : agents.length > 0 ? agents : dummyAgents}
        keyExtractor={(item) => item.id}
        numColumns={width > 600 ? 2 : 1} // 2 columns on tablets, 1 on mobile
        columnWrapperStyle={width > 600 ? styles.rowWrapper : null}
        renderItem={renderAgentCard}
        contentContainerStyle={styles.gridContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 15,
    paddingLeft: 10,
  },
  gridContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  rowWrapper: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: width > 600 ? "48%" : "90%", // 45% on tablets, 90% on mobile
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15, // Softer shadow
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: "#ddd",
  },
  infoContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    width: 120,
  },
  value: {
    fontSize: 14,
  },
});
