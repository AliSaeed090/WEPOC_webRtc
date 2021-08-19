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
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
const url='http://192.168.1.105:5000/wepoc-446d9/us-central1/syncContacts'
// const url='https://us-central1-wepoc-446d9.cloudfunctions.net/syncContacts'
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
    const uid = "903W0ZCzhsWl4ranKJ4D9xZ1Uxt2"
    console.log({ uid, auth:auth().currentUser })
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
