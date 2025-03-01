import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

// Card width adjustments
const cardWidth = Platform.OS === 'web' ? width * 0.20 : width * 0.7;
const cardHeight = 100;

const fetchData = async () => {
  try {
    return [
      { id: 1, title: 'Wealth Associates', count: '12,000', icon: 'account-circle' },
      { id: 2, title: 'Expert Panel Members', count: '1,500', icon: 'account-check' },
      { id: 3, title: 'Investors & Landlords', count: '125', icon: 'airplane' },
      { id: 4, title: 'Customers', count: '5,202', icon: 'account-group' },
      { id: 5, title: 'Total Properties Listed', count: '1,200', icon: 'office-building' },
      { id: 6, title: 'Skilled Resource', count: '2,450', icon: 'human-handsup' },
      { id: 7, title: 'Core Clients', count: '12', icon: 'contacts' },
      { id: 8, title: 'Core Projects', count: '2,450', icon: 'human-handsup' },
      { id: 9, title: 'Channel Partners', count: '2,450', icon: 'account-group' },
    ];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const DashboardCard = ({ title, count, icon }) => (
  <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.count}>{count}</Text>
    <Icon name={icon} size={30} color="#E91E63" style={styles.icon} />
  </View>
);

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };
    getData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={Platform.OS === 'web' ? styles.webGridContainer : styles.mobileContainer}>
        {data.map((item, index) => (
          <DashboardCard key={index} title={item.title} count={item.count} icon={item.icon} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    height: '90vh',
  },
  webGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    width: '85%',
    gap: 15,
  
  },
  mobileContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 6,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  title: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  count: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
});

export default Dashboard;
