import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useState,useEffect } from 'react';
import DynamicAppStyles from '../DynamicAppStyles';
import IMDrawerMenu from '../Core/ui/drawer/IMDrawerMenu/IMDrawerMenu';
import { IMChatScreen,IMContactScreen } from '../Core/chat';
import { IMFriendsScreen, IMCreateGroupScreen, IMAddGroupScreen } from '../Core';
import {
  IMEditProfileScreen,
  IMUserSettingsScreen,
  IMContactUsScreen,
} from '../Core/profile';
import {  Text, TouchableOpacity, DeviceEventEmitter, Platform} from 'react-native';
import * as firebase from 'firebase'
import auth from '@react-native-firebase/auth';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import LoginScreen from '../Core/onboarding/LoginScreen/LoginScreen';
import SignupScreen from '../Core/onboarding/SignupScreen/SignupScreen';
import WelcomeScreen from '../Core/onboarding/WelcomeScreen/WelcomeScreen';
import WalkthroughScreen from '../Core/onboarding/WalkthroughScreen/WalkthroughScreen';
import LoadScreen from '../Core/onboarding/LoadScreen/LoadScreen';
import MyProfileScreen from '../screens/MyProfileScreen/MyProfileScreen';
import ComingSoonScreen from '../screens/ComingSoon/ComingSoonScreen';
import LogoutScreen from '../screens/Logout/LogoutScreen';
import SmsAuthenticationScreen from '../Core/onboarding/SmsAuthenticationScreen/SmsAuthenticationScreen';
import { ResetPasswordScreen } from '../Core/onboarding';
import { IMUserSearchModal } from '../Core/socialgraph/friendships';
import ChatConfig from '../config';
import { NavigationContainer } from '@react-navigation/native';
import { IMLocalized } from '../Core/localization/IMLocalization';
import authManager from '../Core/onboarding/utils/authManager';
import GroupDetail from '../screens/GroupChatDetails/DetailScreen'
import { FriendList } from '../screens/ComingSoon/FriendList'
import GroupChatRoom from '../screens/Video/VideoCall'
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
 

// const url='http://192.168.1.105:5000/wepoc-446d9/us-central1/syncContacts'
const url='https://us-central1-wepoc-446d9.cloudfunctions.net/syncContacts'
import AsyncStorage from '@react-native-community/async-storage';
import {
  setMediaChatReceivers,
  setIsMediaChatVisible,
  setIsCallAccepted,
  setMediaChatData,
} from '../../src/Core/chat/audioVideo/twilio/redux';


// E:\Codes\WEPOC\WEPOC\src\Core\chat\audioVideo\twilio\redux\index.js
import { useDispatch } from 'react-redux';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();
const HomeSearchStackNavigator = createStackNavigator();
const FriendsSearchStackNavigator = createStackNavigator();

const LoginStack = () => {
  return (
    <AuthStack.Navigator>
      <Stack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: ChatConfig,
          authManager: authManager,
        }}
        options={{ headerShown: false }}
        name="Welcome"
        component={WelcomeScreen}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={LoginScreen}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="Signup"
        component={SignupScreen}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="Sms"
        component={SmsAuthenticationScreen}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="ResetPassword"
        component={ResetPasswordScreen}
      />
    </AuthStack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <AppStack.Navigator
      initialRouteName="Home"
      headerMode="float"
      screenOptions={{ headerTitleAlign: 'center' }}>
      <AppStack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
        }}
        name="Home"
        component={HomeScreen}
      />
      <AppStack.Screen name="CreateGroup" component={IMCreateGroupScreen} />
      <AppStack.Screen name="AddMembers" component={IMAddGroupScreen} />
      <AppStack.Screen name="FriendList" component={FriendList} />
      <AppStack.Screen name="GroupChatVideo" component={GroupChatRoom} options={{ headerShown: false }} />
      <AppStack.Screen name="PersonalChat" component={IMChatScreen} />
      <AppStack.Screen name="IMContactScreen" component={IMContactScreen} />
      
    </AppStack.Navigator>
  );
};

const HomeSearchStack = () => {
  return (
    <HomeSearchStackNavigator.Navigator
      mode="modal"
      initialRouteName="Main"
      headerMode="float">
      <HomeSearchStackNavigator.Screen
        name="Main"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <HomeSearchStackNavigator.Screen
        name="UserSearchScreen"
        component={IMUserSearchModal}
        options={{ headerShown: false }}
      />
    </HomeSearchStackNavigator.Navigator>
  );
};

const FriendsStack = () => {
  return (
    <AppStack.Navigator initialRouteName="Friends" headerMode="float">
      <AppStack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          showDrawerMenuButton: true,
        }}
        name="Friends"
        component={IMFriendsScreen}
      />
    </AppStack.Navigator>
  );
};

const FriendsSearchStack = () => {
  return (
    <FriendsSearchStackNavigator.Navigator
      mode="modal"
      initialRouteName="Main"
      headerMode="float">
      <FriendsSearchStackNavigator.Screen
        name="Main"
        component={FriendsStack}
        options={{ headerShown: false }}
      />
      <FriendsSearchStackNavigator.Screen
        name="UserSearchScreen"
        component={IMUserSearchModal}
        options={{ headerShown: false }}
      />
    </FriendsSearchStackNavigator.Navigator>
  );
};

const MyProfileStack = () => {
  return (
    <AuthStack.Navigator>
      <Stack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: ChatConfig,
        }}
        name="MyProfile"
        component={MyProfileScreen}
      />
      <AuthStack.Screen name="AccountDetails" component={IMEditProfileScreen} />
      <AuthStack.Screen name="Settings" component={IMUserSettingsScreen} />
      <AuthStack.Screen name="ContactUs" component={IMContactUsScreen} />
    </AuthStack.Navigator>
  );
};

const ComingSoonStack = () => {
  return (
    <AuthStack.Navigator>
      <Stack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: ChatConfig,
        }}
        name="ComingSoon"
        component={ComingSoonScreen}
      />
    </AuthStack.Navigator>
  );
};

const LogoutStack = () => {
  return (
    <AuthStack.Navigator>
      <Stack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: ChatConfig,
        }}
        name="Logout"
        component={LogoutScreen}
      />
    </AuthStack.Navigator>
  );
};


// drawer stack
const DrawerStack = () => {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      drawerStyle={{ width: 270 }}
      drawerContent={({ navigation, state }) => {
        return (
          <IMDrawerMenu
            navigation={navigation}
            menuItems={ChatConfig.drawerMenu.upperMenu}
            menuItemsSettings={ChatConfig.drawerMenu.lowerMenu}
            appStyles={DynamicAppStyles}
            authManager={authManager}
            appConfig={ChatConfig}
          />
        );
      }}
      initialRouteName="HomeSearchStack">
      <Drawer.Screen name="HomeSearchStack" component={HomeSearchStack} />
      <Drawer.Screen name="FriendsSearchStack" component={FriendsSearchStack} />
      <Drawer.Screen name="MyProfileStack" component={MyProfileStack} />
      <Drawer.Screen name="LogoutStack" component={LogoutStack} />
      <Drawer.Screen name="ComingSoonStack" component={ComingSoonStack} />
    </Drawer.Navigator>
  );
};

const MainStackNavigator = () => {
  useEffect(() => {
    // var uid = firebase.auth().currentUser.uid;

    // const uid = "903W0ZCzhsWl4ranKJ4D9xZ1Uxt2"
    hasAndroidPermission()
  }, [])
  const hasAndroidPermission = async () => {

    var uid = firebase.auth().currentUser.uid;

    // const uid = "903W0ZCzhsWl4ranKJ4D9xZ1Uxt2"
    console.log({ uid, authApp:auth().currentUser })
    // const uid = auth().currentUser.uid

    const permission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
    const hasPermission = await PermissionsAndroid.check(permission);
    console.log({ flag: hasPermission })
    if (Platform.OS === 'android') {


      if (hasPermission) {
        Contacts.getAll().then(contacts => {
          var arr = []
          console.log({ contacts })
          contacts.map((data) => {
            if (data.phoneNumbers.length) {
              let obj = {
                displayName: data.displayName,
                phoneNumber: data.phoneNumbers[0].number.replace(/\s+/g, '').trim()
              }
              arr.push(obj)
              return arr

            }

          })
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var raw = JSON.stringify({"contacts": arr, "uid": uid });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
          console.log({ requestOptions})
          fetch(url, requestOptions)

            .then(response => response.json())
            .then(async (json) => {
              console.log({ json })
              await AsyncStorage.setItem("syncContacts", JSON.stringify(json));
            })
            .catch(error => console.log('error', error));
      
        })

      } else {
        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
      }
    } else {
      Contacts.checkPermission().then(permission => {
        console.log({ permission })
        // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
        if (permission === 'undefined') {
          Contacts.requestPermission().then(permission => {

            Contacts.getAll().then(contacts => {
              var arr = []
              console.log({ contacts })
              contacts.map((data) => {
                console.log({ data })
                if (data.phoneNumbers.length) {
                  let obj = {
                    displayName: data.givenName + data.familyName,
                    phoneNumber: data.phoneNumbers[0].number.replace(/\s+/g, '').trim()
                  }
                  arr.push(obj)
                  return arr

                }

              })
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");

              var raw = JSON.stringify({ "contacts": arr, "uid": uid });

              var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
              };

              fetch(url, requestOptions)

                .then(response => response.json())
                .then(async (json) => {
                  console.log({ json })
                  await AsyncStorage.setItem("syncContacts", JSON.stringify(json));
                })
                .catch(error => console.log('error', error));
              console.log({ arr: JSON.stringify(arr) })
            })
          })
        }
        if (permission === 'authorized') {
          Contacts.getAll().then(contacts => {
            var arr = []
            console.log({ contacts })
            contacts.map((data) => {
              console.log({ data })
              if (data.phoneNumbers.length) {
                let obj = {
                  displayName: data.givenName + data.familyName,
                  phoneNumber: data.phoneNumbers[0].number.replace(/\s+/g, '').trim()
                }
                arr.push(obj)
                return arr

              }

            })
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "contacts": arr, "uid": uid });
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };

            fetch(url, requestOptions)

              .then(response => response.json())
              .then(async (json) => {
                console.log({ json })
                await AsyncStorage.setItem("syncContacts", JSON.stringify(json));
              })
              .catch(error => console.log('error', error));
            console.log({ arr: JSON.stringify(arr) })
          })
        }
        if (permission === 'denied') {
          alert("Please grant contacts permissions")

        }
      })
    }

  }
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="float">
      <Stack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
        }}
        name={IMLocalized('Home')}
        options={{ headerShown: false }}
        component={DrawerStack}
      />
    </Stack.Navigator>
  );
};

// Manifest of possible screens
const RootNavigator = () => {
 
  
  return (
    <RootStack.Navigator
      screenOptions={{ animationEnabled: false, headerBackTitleVisible: false }}
      initialRouteName="LoadScreen">
      <Stack.Screen
        initialParams={{
          appStyles: DynamicAppStyles,
          appConfig: ChatConfig,
        }}
        name="LoadScreen"
        options={{ headerShown: false }}
        component={LoadScreen}
      />
      <RootStack.Screen
        name="Walkthrough"
        options={{ headerShown: false }}
        component={LoginStack}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name="LoginStack"
        component={LoginStack}
      />
      <RootStack.Screen
        name="MainStack"
        options={{ headerShown: false }}
        component={MainStackNavigator}
      />
      <RootStack.Screen
        name="GroupDetails"
        options={{ headerShown: false }}
        component={GroupDetail}
      />
      <RootStack.Screen name="PersonalChat" component={IMChatScreen} />
    </RootStack.Navigator>
  );
};

const AppNavigator = () => {


  return (
    <NavigationContainer>
     
      <RootNavigator />
    </NavigationContainer>
  );
};

export { RootNavigator, AppNavigator };
