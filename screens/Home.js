import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import Button from '../components/Button';
//import { Button } from '@react-native-material/core';
import Icon from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: 'white',
    //maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'yellow',   
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  topBar: {
    flexDirection: 'row',
    padding: 5,
    height: 60,
    backgroundColor: 'yellow',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensures it stays on top of other components
  },
  welcomeText: {
    fontStyle : 'italic',  
    textDecorationStyle : 'dashed',
    fontSize : 15,  
    marginBottom : 20,
    marginTop : 10     
  },
  userImage: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,    
    marginRight: 10,  
    height: 50,     
    // marginLeft: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 10

  },
  userName: {
    fontWeight: '600',
    marginBottom: 5,
    alignSelf: 'Right',
    marginRight: 10
  }, 
  logo: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: width/2,
    paddingLeft: 5,
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
  footer: {
    marginTop: height/1.8,
  },
});
 
export default function Home({ signOut }) {
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();
  const Tab = createBottomTabNavigator();

  return (    
    <View style={styles.container}>
                 
      <View style={styles.topBar}>
      
        <Image source={require('../assets/saayamforall.jpeg')} style={styles.logo}/>
        
        <View style={styles.menu}>
          <TouchableOpacity 
            onPress={() => {Linking.openURL('https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S')}}>
          <Text style={styles.menuItem}>Donate</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => {navigation.navigate("Profile")}}>
            <Image  source={require('../assets/profile.jpg')} style={styles.profileIcon} 
            />
        </TouchableOpacity>
      </View>
      
      <View width='35%'>
        <Button onPress={() => signOut()}>Sign Out</Button>
      </View>

      <View style={styles.footer}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Donate') {
                iconName = focused ? 'dollar-sign' : 'dollar-sign';
                return <Feather name={iconName} size={size} color={color} />;
              } else if (route.name === 'Chat') {
                iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              } else if (route.name === 'Account') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4285F4',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              height: 60,
              paddingBottom: 5,
              paddingTop: 5,
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Donate" component={DonateScreen} />
          <Tab.Screen name="Chat" component={ChatScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
      </View>
    </View>

    
  )
}


function GoToScreen({ screenName }) {
  const navigation = useNavigation();
  // const navigation = NavigationContainer();

  return (
    navigation.navigate(screenName)
  )
}

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function DonateScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Donate Screen</Text>
    </View>
  );
}

function ChatScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chat Screen</Text>
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