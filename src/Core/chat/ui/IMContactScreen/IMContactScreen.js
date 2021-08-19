import React, {

  useEffect,
  useState,
  useLayoutEffect,
} from 'react';
import { Text, View, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Linking, Platform, PermissionsAndroid, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { List, ListItem, Left, Body, Right, Thumbnail, Badge } from 'native-base';
import AppStyles from '../../../../DynamicAppStyles';
import { useSelector } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import Contacts from 'react-native-contacts';
import auth from '@react-native-firebase/auth';

const url='http://192.168.1.104:5000/wepoc-446d9/us-central1/syncContacts'
// const url='https://us-central1-wepoc-446d9.cloudfunctions.net/syncContacts'
export default function IMContactScreen(props) {
  const appStyles = props?.route?.params?.appStyles;
  const colorScheme = useColorScheme();
  const currentTheme = appStyles?.navThemeConstants[colorScheme];
  const currentUser = useSelector((state) => state.auth.user);
  const channels = useSelector((state) => state.chat.channels);
  const [contacts, setContacts] = useState([])
  const [searchContacts, setSearchContacts] = useState([])
  const [qureText, setQureText] = useState("")
  const [loading, setLoading] = useState(false)
  useEffect(async () => {
    hasAndroidPermission()
    setLoading(true)
    var value = await AsyncStorage.getItem("syncContacts");
    if (value === null || value === undefined) {
      hasAndroidPermission()
    }
    else {
      console.log({ value: JSON.parse(value) })
      value = JSON.parse(value)
      setContacts(value.arr)
      setLoading(false)
    }


  }, []);


  const hasAndroidPermission = async () => {
    const uid = "903W0ZCzhsWl4ranKJ4D9xZ1Uxt2"
    console.log({ uid, auth:auth().currentUser })
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
  useLayoutEffect(() => {
    console.log("props==>", props.route.params.title)
    props.navigation.setOptions({
      headerTitle: "My Contact Lists",




      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
  }, []);
  const renderHeader = () => {
    return <TextInput onChangeText={searchFilterFunction} value={qureText} placeholder="Search Here..." clearIcon style={{ backgroundColor: 'tarnsparent', borderWidth: 0.5, borderColor: 'transparent', paddingLeft: 5, height: Platform.OS === "ios" ? 80 : null }} inputContainerStyle={{ backgroundColor: 'white', opacity: 0.8, borderColor: 'transparent' }} />;
  };
  const searchFilterFunction = text => {


    const newData = contacts.filter(items => {


      const itemData = `${items.displayName.toUpperCase()}${items.isAvailable.toString().toUpperCase()}  `;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    setSearchContacts([...newData])
    setQureText(text)
  };
  const renderFooter = () => {
    if (!loading) {
      return (<View style={{ width: '85%', height: 80, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} >
        <Text style={{ color: 'red' }}>No More Contacts to show</Text>
      </View>
      )
    }


    else {
      return (
        <View
          style={{
            width: '90%',
            alignSelf: 'center'
          }}
        >
          <ActivityIndicator size='large' color='black' />

        </View>
      );
    }

  };



  const renderSeparator = () => {
    return (

      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#aaaaaa",

        }}
      />
    );
  };



  const inviteContatc = async (number) => {
    var message = "Dowload WEPOC from  https://play.google.com/store/apps?hl=en&gl=US"
    const separator = Platform.OS === 'ios' ? '&' : '?'
    const url = `sms:${number}${separator}body=${message}`
    await Linking.openURL(url)
  }

  const sendMessage = (user) => {
    var friend = user.item.user
    console.log({ user: user.item.user })
    const id1 = currentUser.id || currentUser.userID;
    const id2 =
      friend.id || friend.userID || friend.user.id || friend.user.userID;
    let channel = {
      id: id1 < id2 ? id1 + id2 : id2 + id1,
      participants: friend.user ? [friend.user] : [friend],
    };

    const otherChannelInfo = channels?.find(
      (currentChannel) => currentChannel.id === channel.id,
    );

    if (otherChannelInfo) {
      channel = {
        ...channel,
        ...otherChannelInfo,
      };
    }


    props.navigation.navigate('PersonalChat', {
      channel,
      appStyles: AppStyles,
    });
  }
  const renderContacts = (items, ind) => {
    // console.log({ items })

    return (
      <List key={"ind"}>

        <ListItem style={{ width: "95%" }} avatar button={true} >




          <Body style={{ borderBottomColor: '#009387', flex: 2 }} >
            <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold', }}>{items.item.displayName}</Text>
            <Text style={{ textAlign: 'justify', marginTop: 5 }}  >{items.item.phoneNumber}</Text>
          </Body>

          <Right style={{ borderBottomColor: '#009387', alignSelf: 'center', borderWidth: 0, flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
            {
              items.item.isAvailable ?
                <TouchableOpacity style={{ padding: 5, width: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4395f8', borderRadius: 20 }} onPress={() => sendMessage(items)} >
                  <Text style={{ color: '#fff' }}>Send Message</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={{ padding: 5, width: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3d3e5e', borderRadius: 20 }} onPress={() => inviteContatc(items.item.phoneNumber)}>

                  <Text style={{ color: '#fff' }}>Invite</Text>
                </TouchableOpacity>
            }
          </Right>


        </ListItem >
      </List >
    )
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {renderHeader()}
      <FlatList
        data={contacts}
        data={qureText != "" ? searchContacts : contacts}
        renderItem={(item, ind) => renderContacts(item, ind)}
        keyExtractor={item => item.phoneNumber}
        ItemSeparatorComponent={renderSeparator}
        ListFooterComponent={renderFooter}

      />

    </View>
  )
}
