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
import Donation from '../screens/Donation/Donation';
import BenevityInfo from '../screens/Benevity/Benevity';
import AdminPanel from '../screens/Admin/AdminPanel';
import Confirmation from '../screens/authentication/Confirmation';
import Skills from '../screens/MenuScreens/Skills';
import Availability from '../screens/MenuScreens/Availability';
import Preferences from '../screens/MenuScreens/Preferences';
import AccountDeletion from '../screens/MenuScreens/AccountDeletion';
import IdentityDocument from '../screens/MenuScreens/IdentityDocument';

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
      <AppStack.Screen name="Administration">
        {() => <Administration signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="UserRequest" component={UserRequest} options={{ title: 'User Request' }} />
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
      <AppStack.Screen name="PromoteToVolunteer" component={PromoteToVolunteer} options={{ title: 'Promote To Volunteer' }}/>  
      <AppStack.Screen name="EditProfile" options={{ title: 'Edit Profile' }}>
        {() => <EditProfile signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="EditPersonal" options={{ title: 'Personal Information' }}>
        {() => <EditPersonal signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="IdentityDocument" options={{ title: 'Identity Document' }}>
        {() => <IdentityDocument signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="EditOrganization" options={{ title: 'Edit Organization' }}>
        {() => <EditOrganization signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="ChangePassword" options={{ title: 'Change Password' }}>
        {() => <ChangePassword signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="Skills" options={{ title: 'Skills' }}>
        {() => <Skills signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="Availability" options={{ title: 'Availability' }}>
        {() => <Availability signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="Preferences" options={{ title: 'Preferences' }}>
        {() => <Preferences signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="AccountDeletion" options={{ title: 'Sign Off' }}>
        {() => <AccountDeletion signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="PrivacyPolicy" options={{ title: 'Privacy Policy' }}>
        {() => <PrivacyPolicy signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="TermsAndConditions" options={{ title: 'Terms And Conditions' }}>
        {() => <TermsAndConditions signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="Welcome">
        {() => <Welcome signOut={signOut} />}
      </AppStack.Screen>
      <AppStack.Screen name="ReqFilter" component={ReqFilter}
        options={{ title: 'Filter' }}/> 
      <AppStack.Screen name="Notification" component={Notification} 
        options={{ title: 'Notifications' }}/>
      <AppStack.Screen name="Donation" component={Donation} 
        options={{ title: 'Donation' }}/>
      <AppStack.Screen name="Benevity" component={BenevityInfo} 
        options={{ title: 'Benevity' }}/>
      <AppStack.Screen name="Admin" component={AdminPanel} 
        options={{ title: 'Administration' }}/>
      <AppStack.Screen name="ConfirmUpdate" options={{ headerShown: false }}>
        {() => <Confirmation isUpdate={true}/>}
      </AppStack.Screen>
    </AppStack.Navigator>
  );
}
