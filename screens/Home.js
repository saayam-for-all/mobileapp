import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import Button from '../components/Button';
//import { Button } from '@react-native-material/core';
import Icon from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

//import { Dimensions } from 'react-native';
//const { width, height } = Dimensions.get("window");

import Ionicons from '@expo/vector-icons/Ionicons';

import config from '../components/config';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',    
  },
  topBar: {
    flexDirection: 'row',   
    padding: 5,
    height: 50,
    backgroundColor: 'yellow',
    justifyContent: 'space-between',
    alignItems: 'center',   
  },  
  buttonStyle: {
    width: config.deviceWidth/3,
    paddingTop: config.deviceHeight/1.5,
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 25,
    //marginRight: width/2,
    paddingLeft: 5,
    //marginRight: width/2.2,
    marginRight: config.deviceWidth/2,
  },
  menuItem: {
    marginHorizontal: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // Set the text color to black
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBarContainer: {
    marginTop:10,
    //marginTop: -50, // Adjust this margin to match the height of the top bar
    paddingHorizontal: 0,
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    marginLeft: 15,
    marginRight: 15,
    marginTop:5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    bottom:0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginLeft:15,
    marginRight:15,
    marginTop: 10,
    //marginTop: 40,
    marginBottom: 10,
  },
  buttonView: {
    width: '45%',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  fullWidthButton: {
    width: '100%', // Full width when only one button is in the row
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#a9c9ff',
    borderRadius: 8,
    marginVertical: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom:10,
  },
  actionButtonText: {
    fontSize: 20,
    color: '#4f8ef7',
    fontWeight: 'bold',
  },
});
 
export default function Home({ signOut }) {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();
  const Tab = createBottomTabNavigator();

  return (    
    <SafeAreaView style={styles.container}>

      {/* Top Bar */}           
      <View style={styles.topBar}>
      
        <Image source={require('../assets/saayamforall.jpeg')} style={styles.logo}/>
        
        <View style={styles.menu}>
          <TouchableOpacity 
            onPress={() => {Linking.openURL('https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S')}}>
          <Text style={styles.menuItem}>Donate</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => {navigation.navigate("Profile")}}>
           <Ionicons name="person-circle-outline" size={40} color="black" />
        </TouchableOpacity>
        </View>
      
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search categories or request..."
          placeholderTextColor="#888"
        />
      </View>
      
       {/* Button Container */}
       <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonView} onPress={() => {navigation.navigate("MyReqs")}}>
          <Text style={styles.buttonText}>My Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonView} onPress={() => {navigation.navigate("ManagedReqs")}}>
          <Text style={styles.buttonText}>Managed Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.buttonView, styles.fullWidthButton]} onPress={() => {navigation.navigate("OtherRequests")}}>
          <Text style={styles.buttonText}>Others Requests</Text>
        </TouchableOpacity>
      </View>

      <View>
      {/* Action Buttons */}
      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('PromoteToVolunteer')}>
        <Icon name="heart-outline" size={20} color="#4f8ef7" />
        <Text style={styles.actionButtonText}> Become a volunteer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'blue' }]} 
      onPress={() => navigation.navigate('UserRequest')}>
        <Icon name="add-outline" size={20} color="#fff" />
        <Text style={[styles.actionButtonText, { color: '#fff' }]}> Create a request</Text>
      </TouchableOpacity>
      </View>

      {/* <View style={styles.buttonRow}>
        <Button onPress={() => signOut()}>Sign Out</Button>
        <Button onPress={() => navigation.navigate('UserRequest')}>
          Create a request
        </Button>
      </View> */}

      {/* Bottom Tab Bar */}
      <View style={styles.footer}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home1') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Donate') 
                {
                iconName = 'hand-holding-heart';
                return (
                  <FontAwesome5
                    name='hand-holding-heart'
                    size={size}
                    color={focused ? '#4285F4' : 'gray'} 
                  />
                ); 
              }  else if (route.name === 'Notification') {
                iconName = focused ? 'notifications' : 'notifications-outline';
              } else if (route.name === 'Account') {
                iconName = focused ? 'person-circle' : 'person-circle-outline';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4285F4',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              height: 60,
              paddingBottom: 15,
              paddingTop: 5,
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
          })}
        >
          <Tab.Screen name="Home1" options={{ title: 'Home' }} component={HomeTabScreen} />
          <Tab.Screen name="Donate" component={DonateScreen}
          listeners={{
            tabPress: (e) => {
              openPayPal();
            },
          }}
        />
          <Tab.Screen name="Notification" 
          component={NotificationScreen} 
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => navigation.navigate("Notification")}
              />
            ),
          }}
          />
          

          
          
          <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
      </View>

    </SafeAreaView>

  )
}

function GoToScreen({ screenName }) {
  const navigation = useNavigation();
  // const navigation = NavigationContainer();

  return (
    navigation.navigate(screenName)
  )
}

function HomeTabScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const openPayPal = () => {
  const paypalUrl = 'https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S';
  Linking.openURL(paypalUrl).catch(() =>
    Alert.alert('Error', 'Failed to open PayPal link. Please try again later.')
  );
};

function DonateScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Donate Screen</Text>
    </View>
  );
}

function NotificationScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notification Screen</Text>
    </View>
  );
}

function AccountScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Account Screen</Text>
    </View>
  );
}
