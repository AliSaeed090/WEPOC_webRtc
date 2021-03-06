/* https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, TouchableOpacity, DeviceEventEmitter, } from 'react-native';
import { Provider } from 'react-redux';
// import * as RNLocalize from "expo-localization";
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { setI18nConfig } from './src/Core/localization/IMLocalization';
import { AppNavigator } from './src/navigations/AppNavigation';
import { AppCallWrapper } from './src/Core/chat/audioVideo';
import reduxStore from './src/redux/store';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

import AsyncStorage from '@react-native-community/async-storage';
const MainNavigator = AppCallWrapper(AppNavigator);

const useForceUpdate = () => useState()[1];



const App = (props) => {

  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    hasAndroidPermission()
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

  const hasAndroidPermission = async () => {

    const permission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
    const hasPermission = await PermissionsAndroid.check(permission);
    console.log({ flag: hasPermission })
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

        var raw = JSON.stringify({ "contacts": arr });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("https://us-central1-wepoc-446d9.cloudfunctions.net/syncContacts", requestOptions)

          .then(response => response.json())
          .then( async (json)  => {
            console.log({ json })
            await AsyncStorage.setItem("syncContacts", JSON.stringify(json));
          })
          .catch(error => console.log('error', error));
        console.log({ arr: JSON.stringify(arr) })
      })

    } else {
      const status = await PermissionsAndroid.request(permission);
      return status === 'granted';
    }

  }

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
