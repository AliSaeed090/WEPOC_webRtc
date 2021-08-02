import React, { Component } from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
// import { Icon, } from 'react-native-elements';
import DialogInput from 'react-native-dialog-input';
import { firebase } from '../../Core/firebase/config'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenTrack: '',
      isDialogVisible: false
    };
  }
  sendInput(text) {
    var key = firebase.database().ref(`${text}/`).push().key;
    let object = {
      groupkey: key
    }
    firebase.database().ref(`${text}/`).set(object).then((success) => {
      console.log("successfully added")
    })
      .catch((error) => {
        console.log(error.message)
      })
    this.props.navigation.navigate('GroupChatroom', { chatgroupname: text })
    this.setState({ isDialogVisible: false })
  }
  showDialog = () => {
    this.setState({ isDialogVisible: false })
  }


  render() {
    return (
      <>
        <SafeAreaView style={{ flex: 0 }} />
        <SafeAreaView style={{ flex: 1 }}>
          <DialogInput isDialogVisible={this.state.isDialogVisible}
            title="Create Group"
            message={"You can add members in group chat"}
            hintInput="Type Group name Here"
            submitInput={(inputText) => { this.sendInput(inputText) }}
            closeDialog={this.showDialog}>
          </DialogInput>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Cretae Group" onPress={() => this.setState({ isDialogVisible: true })} />
          </View>
        </SafeAreaView>
      </>

    );
  }

}
