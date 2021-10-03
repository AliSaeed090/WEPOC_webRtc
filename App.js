/* https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, TouchableOpacity, DeviceEventEmitter, Platform } from 'react-native';
import { Provider } from 'react-redux';
// import * as RNLocalize from "expo-localization";
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { setI18nConfig } from './src/Core/localization/IMLocalization';
import { AppNavigator } from './src/navigations/AppNavigation';
import { AppCallWrapper } from './src/Core/chat/audioVideo';
import reduxStore from './src/redux/store';
import IncomingCall from 'react-native-incoming-call';

const MainNavigator = AppCallWrapper(AppNavigator);
import * as firebase from 'firebase'
const useForceUpdate = () => useState()[1];
import messaging from '@react-native-firebase/messaging';
import VoipPushNotification from 'react-native-voip-push-notification';



const App = (props) => {

  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(async() => {
    const token = await messaging().getToken();
    // console.log({token})
 
    if (Platform.OS === 'ios') {
      VoipPushNotification.requestPermissions();
      VoipPushNotification.registerVoipToken();

      VoipPushNotification.addEventListener('register', (token) => {
        console.log('push kit token from ios', token);
         console.log({ pushKitToken: token });
      });
    }
    console.disableYellowBox = true;
    setI18nConfig();
    // RNLocalize.addEventListener("change", handleLocalizationChange);
    Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });
    return () => {
      // RNLocalize.removeEventListener("change", handleLocalizationChange);
    };

  }, []);

  const handleLocalizationChange = () => {
    setI18nConfig();
    useForceUpdate();
  };



  const [contacts, setContacts] = useState([])

 

  const loadContacts = async () => {

    if (await hasAndroidPermission()) {

    }
    return
  };



  return (
    <Provider store={reduxStore}>
      <AppearanceProvider>
        <StatusBar />
        <MainNavigator screenProps={{ theme: colorScheme }} />
      </AppearanceProvider>
    </Provider>
  );
};

// AppRegistry.registerComponent("App", () => App);

export default App;
