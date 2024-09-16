import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import UserRequest from '../screens/UserRequest';
import Availability from '../screens/Become Volunteer/Availability';
import MyReqs from '../screens/AllRequests/MyReqs';
import OtherRequests from '../screens/AllRequests/OtherRequests';
import ManagedReqs from '../screens/AllRequests/ManagedReqs';
import RequestDetails from '../screens/AllRequests/RequestDetails';

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
      <AppStack.Screen name="Availability" component={Availability} />
      <AppStack.Screen name="MyReqs" component={MyReqs} 
        options={{ title: 'My Requests' }}/>
      <AppStack.Screen name="OtherRequests" component={OtherRequests} 
        options={{ title: 'Other Requests' }}/>
      <AppStack.Screen name="ManagedReqs" component={ManagedReqs} 
        options={{ title: 'Managed Requests' }}/>
      <AppStack.Screen name="RequestDetails" component={RequestDetails} 
        //options={{ title: 'Request Details' }}
        options={({ route }) => ({ title: 'Request Id : ' + route.params.reqTitle })}/>
    </AppStack.Navigator>
  );
}
