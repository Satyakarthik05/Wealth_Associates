import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, useWindowDimensions } from "react-native";

const ViewNriCard = ({ viewNri }) => {
  return (
    <View style={styles.card}>
      <Image source={require("../Admin_Pan/assets/man.png")} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{viewNri.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Mobile Number:</Text>
          <Text style={styles.value}>{viewNri.mobile}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Occupation:</Text>
          <Text style={styles.value}>{viewNri.occupation}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{viewNri.location}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Country:</Text>
          <Text style={styles.value}>{viewNri.country}</Text>
        </View>
      </View>
    </View>
  );
};

const ViewNri = () => {
  const viewNris = [
    { id: "1", name: "Dummy 1", mobile: "1234567890", occupation: "Finance", location: "Dallas", country: "USA" },
    { id: "2", name: "Dummy 2", mobile: "0987654321", occupation: "Medical", location: "Dallas", country: "USA" },
  ];

  const { width } = useWindowDimensions();
  const isWebView = width > 600;

  return (
    <FlatList
      data={viewNris}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ViewNriCard viewNri={item} />}
      contentContainerStyle={isWebView ? styles.webContainer : styles.listContainer}
      numColumns={isWebView ? 3 : 1} // Grid on web, list on mobile
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

export default ViewNri;