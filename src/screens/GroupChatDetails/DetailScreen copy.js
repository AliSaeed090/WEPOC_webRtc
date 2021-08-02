import React from 'react'
import { Image, Text } from 'react-native';
import StickyParallaxHeader from 'react-native-sticky-parallax-header'
import { Dimensions, View, Switch } from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import { StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import IMFriendListComponent from '../../Core/socialgraph/friendships/ui/IMFriendsScreen/IMFriendsScreen'
import DialogInput from 'react-native-dialog-input';
import * as firebase from 'firebase'
import { Alert } from 'react-native';
import { Header } from 'react-native/Libraries/NewAppScreen';
import AppStyles from '../../DynamicAppStyles';
import { ConnectionStatusBar } from 'react-native-ui-lib';
// import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { channelManager } from '../../Core/chat/firebase';


const width = Dimensions.get('screen').width;
const db = firebase.firestore();

export default class DetailScreen extends React.Component {

  // colorScheme = useColorScheme();
  // currentTheme = AppStyles.navThemeConstants[colorScheme];

  // channel = this.props?.route.params.channel;
  

  constructor() {
    super();
    this.state = {
      isDialogVisible: false,
      ParticipantData: [],
      channel:[]
    }
  }

  componentDidMount() {
    //let channelJson = this.props?.route.params.channel;
    this.getData();
    // let channelJson = this.props?.route.params.channel;
    // this.setState({ParticipantData:channelJson.participants})
  }

  getData = () => {
    var currentuser = firebase.auth()?.currentUser?.uid;
    // alert(currentuser)
    db.collection("channels").doc(`${currentuser}`).get().then((snapshot) => {
      console.log(snapshot.data().participants)
      this.setState({ ParticipantData: snapshot?.data()?.participants })
    })

  }


  // sendInput = (text) => {
  //   var key = firebase.database().ref(this.props?.route.params.title).push().key;
  //   let object = {
  //     key: key,
  //     membername: text

  //   }
  //   firebase.database().ref(`${this.props?.route.params.title}/`).push(object).then((success) => {
  //     alert('Member Added Successfully')
  //     this.setState({ isDialogVisible: false })
  //     this.getData();
  //   })
  //     .catch((error) => {
  //       console.log(error.message)
  //     })
  //}


  delete(item) {
    //console.log(item);
    let channel = this.props?.route.params.channel;

    Alert.alert(
      IMLocalized(`Leave ${channel?.name ?? 'group'}`),
      IMLocalized('Are you sure you want to Remove this Participant?'),
      [
        {
          text: 'Yes',
          onPress: this.onLeaveDecided(item),
          style: 'destructive',
        },
        { text: 'No' },
      ],
      { cancelable: false },
    );

    // db.collection('channels').doc(`${item}`).delete().then(() => {
    //   alert("Member Removed Successfully")
    //   this.getData()
    //   // this.props.navigation.goBack()
    // }).catch((error) => {
    //   console.log("Error====>", error.message)
    // })

    // const Data = this.state.ParticipantData.filter((elem) => {
    //   return elem.firstName !== item.firstName
    // })
    // this.setState({ ParticipantData: Data })
  }
  
  onLeaveDecided(item) {
    // alert(item.id)
    let channel = this.props?.route.params.channel;
    channelManager.onLeaveGroup(
      channel.id,
      item.id,
      ({ success, error }) => {
        if (success) {
          alert("Member Removed Successfully")
        }
        if (error) {
          alert(error);
        }
      },
    );
  };


  renderforeground = () => {
    return <>

      {/* <Image source={require('../../../assets/wepoc/back1.jpg')} /> */}

    </>
  }

  // onLeave = () => {
  //   Alert.alert(
  //     IMLocalized(`Leave ${channel?.name ?? 'group'}`),
  //     IMLocalized('Are you sure you want to leave this group?'),
  //     [
  //       {
  //         text: 'Yes',
  //         onPress: onLeaveDecided,
  //         style: 'destructive',
  //       },
  //       { text: 'No' },
  //     ],
  //     { cancelable: false },
  //   );
  // };

  renderBody = () => {
    
    return <>
      {/* <View style={styles.Container}>
        <Text style={styles.title}>Add Group Description</Text>
      </View> */}


      {/* <View style={{ width: width, backgroundColor: 'white', marginTop: 10, alignSelf: 'center', paddingHorizontal: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.media}>Media, Links and docs</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: 'black', fontSize: 16, }}>2</Text>
          <Icon name="chevron-right" type="feather" color="black" />
        </View>
      </View> */}




      {/* <View style={styles.box}>

        <View style={{ paddingHorizontal: 20, padding: 20 }}>
          <Text style={styles.title}>Custom Notification</Text>
        </View>
        <Divider style={{ backgroundColor: 'black', width: width / 1.1, alignSelf: 'center' }} />
         
        <View style={{ paddingHorizontal: 20, padding: 20 }}>
          <Text style={styles.title}>Media Visibility</Text>
        </View> 
      </View> */}


      <View style={styles.box}>
        <View style={{ paddingHorizontal: 20, padding: 20 }}>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between'
          }}>
            <Text style={styles.participant}>{this.state?.ParticipantData?.length} Participant </Text>
            {/* <Icon name="search" type="feather" color="#3BA599" /> */}
          </View>

          <View style={styles.box}>
            <TouchableOpacity onPress={() => { this.setState({ isDialogVisible: true }) }}>
              <View style={{ paddingHorizontal: 20, padding: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name="plus-circle" type="material-community" color="#3BA599" />
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateGroup', { appStyles: AppStyles, title: "ADD" })}>
                    <Text style={styles.add}>Add Participants</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

          </View>

          {this.state?.ParticipantData?.length ? this.state.ParticipantData.map((item, i) => {
            return (
              <>
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  <Image source={{ uri: item?.profilePictureURL }} style={{ width: 30, height: 30, borderRadius: 30 / 2 }} />
                  <View style={{ marginHorizontal: 10, flex: 1, alignContent: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.name}>{item?.firstName} {item?.lastName}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon name="exit-outline" type="ionicon" color="#3BA599" onPress={() => this.delete(item)} />
                    </View>
                  </View>
                </View>

              </>
            )
          }) : <Text>No participant Added</Text>}
        </View>

      </View>

      <View style={styles.box}>
        <View style={{ paddingHorizontal: 20, padding: 20 }}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="exit-outline" type="ionicon" color="#3BA599" />
            <Text style={styles.exit}>Exit group</Text>
          </View>
        </View>



      </View>

      {/* <View style={styles.box}>
        <View style={{ paddingHorizontal: 20, padding: 20 }}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="dislike2" type="antdesign" color="#3BA599" />
            <Text style={styles.report}>Report group</Text>
          </View>
        </View>
      </View> */}


      {/* <DialogInput isDialogVisible={this.state.isDialogVisible}
        title={this.props?.route.params.title}
        message="Add Member"
        children={"initValueTextInput	"}
        hintInput="Type Member name Here"
        submitInput={(inputText) => { this.sendInput(inputText) }}
        closeDialog={() => { this.setState({ isDialogVisible: false }) }}>
      </DialogInput>
 */}


    </>
  }
  render() {
    let channelJson = this.props?.route.params.channel;

    return (

      <>
        <SafeAreaView style={{ flex: 0 }} />
        <SafeAreaView style={{ flex: 1 }}>
          <StickyParallaxHeader
            bounces={true}
            foreground={this.renderforeground}
            parallaxHeight={300}
            hasBorderRadius={false}
            rightTopIcon={null}
            header={this.renderHeader}
            headerType='AvatarHeader'
            backgroundColor= '#3d3e5e'
            leftTopIconOnPress={() => this.props.navigation.goBack() }
            // leftTopIcon={require('../../../assets/icons/left-arrow.png')}
            backgroundImage={require('../../../assets/wepoc/back1.jpg')}
            image={require('../../../assets/wepoc/back1.jpg')}
            title={<Text style={styles.headerTitle}>{channelJson.name}</Text>}
            subtitle={<Text style={styles.headersubtitle}></Text>}
            renderBody={this.renderBody} />
        </SafeAreaView>
      </>
    )
  }
}
const styles = StyleSheet.create({
  Container: {
    width: width,
    backgroundColor: 'white',
    alignSelf: 'center',
    paddingHorizontal: 20,
    padding: 20
  },
  box: {
    // flex: 1,
    width: width,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: 10,
    // height: 100,
  },
  title: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'SF-Pro-Display-Medium',
    textAlignVertical: 'center'
  },
  add: {
    fontSize: 15,
    color: 'black',
    marginHorizontal: 10,
    fontFamily: 'SF-Pro-Display-Medium',
    textAlignVertical: 'center'
  },
  headersubtitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'SF-Pro-Display-Medium',
    textAlignVertical: 'center'
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'SF-Pro-Display-Medium',
    textAlignVertical: 'center'
  },
  media: {
    color: '#3BA599',
    fontFamily: 'SF-Pro-Display-Medium',
    textAlignVertical: 'center',
    fontSize: 15
  },
  subtitle: {

    fontSize: 13,
    color: 'black',
    fontFamily: 'SF-Pro-Display-Medium',
    textAlignVertical: 'center'
  },
  name: {
    marginTop: 3,
    textAlignVertical: 'center',
    fontSize: 15,
    color: 'black',
    fontFamily: 'SF-Pro-Display-Medium',
    textAlignVertical: 'center'
  },
  status: {

    textAlignVertical: 'center',
    fontSize: 13,
    color: 'black',
    fontFamily: 'SF-Pro-Display-Medium',
    textAlignVertical: 'center'

  },
  participant: {
    textAlignVertical: 'center',
    fontSize: 15,
    color: '#3BA599',
    fontFamily: 'SF-Pro-Display-Medium',
    textAlignVertical: 'center'
  },
  exit: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'black',
    fontFamily: 'SF-Pro-Display-Medium',
    textAlignVertical: 'center'
  },

  report: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'black',
    fontFamily: 'SF-Pro-Display-Medium',
    textAlignVertical: 'center'
  }
})
