import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const LoginPageScreen = () => {
    const navigation = useNavigation();

    const handleSubItemClick = (option) => {
        if (option.name === "Agent") {
            navigation.navigate("Homes");
        } else  if (option.name === "Customer") {
            navigation.navigate("CustomerDashboard");
        } else  if (option.name === "Core Member") {
            navigation.navigate("CoreDashboard");
        } else  if (option.name === "Refferal") {
            navigation.navigate("Homes");
        } else  if (option.name === "Referral") {
            navigation.navigate("Homes");
        } else  if (option.name === "NRI") {
            navigation.navigate("Homes");
        }
    };

    const loginOptions = [
        { name: "Agent", icon: <MaterialIcons name="real-estate-agent" size={hp("4%") } color="white" /> },
        { name: "Customer", icon: <FontAwesome5 name="user" size={hp("4%") } color="white" /> },
        { name: "Core Member", icon: <Ionicons name="link" size={hp("4%") } color="white" /> },
        { name: "Referral", icon: <FontAwesome5 name="users" size={hp("4%") } color="white" /> },
        { name: "Investor", icon: <FontAwesome5 name="hand-holding-usd" size={hp("4%") } color="white" /> },
        { name: "NRI", icon: <MaterialIcons name="flight" size={hp("4%") } color="white" /> },
        { name: "Skilled Resource", icon: <FontAwesome5 name="user-tie" size={hp("4%") } color="white" /> },
    ];

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.welcomeText}>Welcome To Wealth Associates</Text>
            <Text style={styles.loginAsText}>Login as</Text>
            
            <View style={styles.gridContainer}>
                {loginOptions.map((option, index) => (
                    <TouchableOpacity key={index} style={styles.button} onPress={() => handleSubItemClick(option)}>
                        {option.icon}
                        <Text style={styles.buttonText}>{option.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        paddingTop: hp("5%"),
        width: "100%",
    },
    logo: {
        width: wp("40%"),
        height: hp("15%"),
        resizeMode: "contain",
        marginBottom: hp("3%"),
    },
    welcomeText: {
        fontSize: hp("3.5%"),
        fontWeight: "bold",
        color: "#D81B60",
        marginBottom: hp("1%"),
    },
    loginAsText: {
        fontSize: hp("3%"),
        fontWeight: "600",
        marginBottom: hp("3%"),
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: wp("2%"),
        width: "90%",
    },
    button: {
        width: wp("18%"),
        height: hp("20%"),
        backgroundColor: "#D81B60",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: hp("1%"),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: hp("2%"),
        marginTop: hp("1%"),
        textAlign: "center",
    },
});

export default LoginPageScreen;
