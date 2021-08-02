
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ImageBackground, Image } from 'react-native';
import { View, Text, SafeAreaView } from 'react-native';
import { Icon } from 'react-native-elements';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'https://images.unsplash.com/photo-1578324356967-7b8560c41cbf?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=376&q=80'
    };
  }

  componentDidMount() {
    console.log("params==>", this.props?.route.params.channel.otherParticipants)
  }
  render() {

    const currentUser = this?.props?.route.params.currentUser

    return (
      <>
        <SafeAreaView style={{ flex: 0 }} />
        <SafeAreaView style={{ flex: 1, }}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <ImageBackground source={{ uri: this.state.image }} style={{ flex: 1, resizeMode: 'contain' }}>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>

              <View style={{ marginVertical: 10 }}>
                <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>{this?.props?.route.params.channel.name}</Text>
              </View>
              <View style={{ alignSelf: 'center', marginVertical: 40 }}>
                <Image source={{ uri: currentUser.profilePictureURL }} style={{ width: 70, height: 70, borderRadius: 70 / 2 }} />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                <TouchableOpacity
                // onPress={() => { this.setState({ image: this.props.route.params.channel.otherParticipants[0].profilePictureURL }) }}
                >
                  <Image source={{ uri: this.props?.route.params.channel.otherParticipants[0].profilePictureURL.length ? this.props?.route.params.channel.otherParticipants[0].profilePictureURL : null }} style={{ width: 70, height: 70, borderRadius: 70 / 2 }} />
                </TouchableOpacity>

                {/* <TouchableOpacity
                // onPress={() => { this.setState({ image: this.props?.route.params.channel.otherParticipants[1].profilePictureURL }) }}
                >
                  <Image source={{ uri: this.props?.route.params.channel.otherParticipants[1].profilePictureURL.length ? this.props?.route.params.channel.otherParticipants[1].profilePictureURL : null }} style={{ width: 70, height: 70, borderRadius: 70 / 2 }} />
                </TouchableOpacity> */}

              </View>



              <View>

                <View style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: 20 }}>
                  {/* <TouchableOpacity
                  // onPress={() => { this.setState({ image: this.props?.route.params.channel.otherParticipants[2].profilePictureURL }) }}
                  >
                    <Image source={{ uri: this.props?.route.params.channel.otherParticipants[2].profilePictureURL.length ? this.props?.route.params.channel.otherParticipants[2].profilePictureURL : null }} style={{ width: 70, height: 70, borderRadius: 70 / 2, marginHorizontal: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                  // onPress={() => { this.setState({ image: this.props?.route.params.channel.otherParticipants[3].profilePictureURL }) }}
                  >
                    <Image source={{ uri: this.props?.route.params.channel.otherParticipants[3].profilePictureURL.length ? this.props?.route.params.channel.otherParticipants[3].profilePictureURL : null }} style={{ width: 70, height: 70, borderRadius: 70 / 2, marginHorizontal: 5 }} />
                  </TouchableOpacity> */}


                </View>

                <View style={{ backgroundColor: '#1A1A1A', padding: 25, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity>
                    <Icon name="video" type="feather" color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon name="mic" type="feather" color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon name="monitor-share" type="material-community" color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon name="md-chatbox-outline" type="ionicon" color="white" />
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </ImageBackground>
        </SafeAreaView> 
      </>
    );
  }
}
