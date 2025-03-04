import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "../data/ApiUrl";

const ExpertCard = ({ expert }) => {
  return (
    <View style={styles.card}>
      <Image
        source={require("../Admin_Pan/assets/man.png")}
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{expert.Name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile Number:</Text>
          <Text style={styles.value}>{expert.MobileNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Expert Type:</Text>
          <Text style={styles.value}>{expert.ExpertType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Expert Name:</Text>
          <Text style={styles.value}>{expert.ExpertName}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Resolved</Text>
      </TouchableOpacity>
    </View>
  );
};

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const isWebView = width > 600;

  useEffect(() => {
    fetch(`${API_URL}/requestexpert/all`)
      .then((response) => response.json())
      .then((data) => {
        setExperts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching experts:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#e91e63"
        style={{ marginTop: 50 }}
      />
    );
  }

  return (
    <FlatList
      data={experts}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item }) => <ExpertCard expert={item} />}
      contentContainerStyle={
        isWebView ? styles.webContainer : styles.listContainer
      }
      numColumns={isWebView ? 3 : 1}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 20,
  },
  webContainer: {
    justifyContent: "center",
    paddingVertical: 90,
    marginLeft: 100,
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginVertical: 10,
    width: 280,
    height: 300,
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 10,
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#555",
    textAlign: "right",
  },
  button: {
    backgroundColor: "#e91e63",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ExpertList;
