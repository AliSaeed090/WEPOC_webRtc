import React, { Component } from 'react';
import { TouchableHighlight, StatusBar, View, Text } from 'react-native';

export default class GroupChatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <TouchableHighlight underlayColor="transparent" onPress={() => this.props.navigation.navigate('GroupChatDetailsScreen', { title: this.props?.route.params.chatgroupname })}>
        <View style={{ padding: 30, backgroundColor: 'black' }}>
          <StatusBar backgroundColor='black' barStyle="light-content" />
          <Text style={{ textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>{this.props?.route.params.chatgroupname}</Text>
        </View>
      </TouchableHighlight>
    )
      ;
  }
}
