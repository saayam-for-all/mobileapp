import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import UserRequest from '../screens/UserRequest';
import MyReqs from '../screens/AllRequests/MyReqs';
import OtherRequests from '../screens/AllRequests/OtherRequests';
import ManagedReqs from '../screens/AllRequests/ManagedReqs';
import EditProfile from  '../screens/MenuScreens/EditProfile';
import Welcome from  '../screens/MenuScreens/Welcome';
import ChangePassword from '../screens/MenuScreens/ChangePassword';
import PrivacyPolicy from '../screens/MenuScreens/PrivacyPolicy';
import TermsAndConditions from '../screens/MenuScreens/TermsAndConditions';



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
      <AppStack.Screen name="UserRequest" component={UserRequest} />
      <AppStack.Screen name="MyReqs" component={MyReqs} 
        options={{ title: 'My Requests' }}/>
    <AppStack.Screen name="OtherRequests" component={OtherRequests} 
        options={{ title: 'Other Requests' }}/>
    <AppStack.Screen name="ManagedReqs" component={ManagedReqs} 
    options={{ title: 'Managed Requests' }}/>
      <AppStack.Screen name="EditProfile">
        {() => <EditProfile signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="ChangePassword">
        {() => <ChangePassword signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="PrivacyPolicy">
        {() => <PrivacyPolicy signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="TermsAndConditions">
        {() => <TermsAndConditions signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="Welcome">
        {() => <Welcome signOut={signOut} />}
      </AppStack.Screen>
    </AppStack.Navigator>
  );
}
