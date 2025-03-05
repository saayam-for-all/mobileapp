import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Administration from '../screens/Administration';
import UserRequest from '../screens/UserRequest';
import MyReqs from '../screens/AllRequests/MyReqs';
import OtherRequests from '../screens/AllRequests/OtherRequests';
import ManagedReqs from '../screens/AllRequests/ManagedReqs';
import RequestDetails from '../screens/AllRequests/RequestDetails/RequestDetails';
import PromoteToVolunteer from '../screens/Volunteer/PromoteToVolunteer';
import Welcome from  '../screens/MenuScreens/Welcome';
import ChangePassword from '../screens/MenuScreens/ChangePassword';
import PrivacyPolicy from '../screens/MenuScreens/PrivacyPolicy';
import TermsAndConditions from '../screens/MenuScreens/TermsAndConditions';
import EditProfile from  '../screens/MenuScreens/EditProfile';
import EditOrganization from  '../screens/MenuScreens/EditOrganization';
import EditPersonal from  '../screens/MenuScreens/EditPersonal';
import ReqFilter from '../screens/AllRequests/ReqFilter';
import Notification from '../screens/Notifications/Notification';
import AdminPanel from '../screens/Admin/AdminPanel';

const AppStack = createStackNavigator();

export default function App({ signOut, firstTime = false }) {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home">
        {() => <Home signOut={signOut} firstTime={firstTime} />}
      </AppStack.Screen>
      <AppStack.Screen name="Profile">
        {() => <Profile signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="Administration">
        {() => <Administration signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="UserRequest" component={UserRequest} />
      <AppStack.Screen name="MyReqs" component={MyReqs} 
        options={{ title: 'My Requests' }}/>
      <AppStack.Screen name="OtherRequests" component={OtherRequests} 
        options={{ title: 'Other Requests' }}/>
      <AppStack.Screen name="ManagedReqs" component={ManagedReqs} 
        options={{ title: 'Managed Requests' }}/>
      <AppStack.Screen name="RequestDetails" 
        //options={{ title: 'Request Details' }}
        options={({ route }) => ({ title: 'Request Id : ' + route.params.reqTitle })}>
          {() => <RequestDetails signOut={signOut} />}</AppStack.Screen>
      <AppStack.Screen name="PromoteToVolunteer" component={PromoteToVolunteer}/>  
      <AppStack.Screen name="EditProfile">
        {() => <EditProfile signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="EditPersonal">
        {() => <EditPersonal signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="EditOrganization">
        {() => <EditOrganization signOut={signOut} />}
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
      <AppStack.Screen name="ReqFilter" component={ReqFilter}
      options={{ title: 'Filter' }}/> 
      <AppStack.Screen name="Notification" component={Notification} 
      options={{ title: 'Notifications' }}/>
      <AppStack.Screen name="Admin" component={AdminPanel} 
        options={{ title: 'Administration' }}/>
    </AppStack.Navigator>
  );
}
