import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import UserRequest from '../screens/UserRequest';
import EditProfile from '../screens/EditProfile';
import Welcome from '../screens/Welcome';

const AppStack = createStackNavigator();

export default function App({ signOut }) {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home">
        {() => <Home signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="Profile">
        {() => <Profile signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="EditProfile">
        {() => <EditProfile signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="Welcome">
        {() => <Welcome signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="UserRequest" component={UserRequest} />
    </AppStack.Navigator>
    
  );
}
