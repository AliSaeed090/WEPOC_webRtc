import PropTypes from 'prop-types';
import React, {
  Component,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from 'react';

import { BackHandler, View, Alert } from 'react-native';
import TextButton from 'react-native-button';
import { useSelector } from 'react-redux';
import { IMCreateGroupComponent, IMAddGroupComponent } from '../..';
import { channelManager } from '../../firebase';
import * as firebase from 'firebase'
import { IMLocalized } from '../../../localization/IMLocalization';
import { useColorScheme } from 'react-native-appearance';
const db = firebase.firestore();

const IMAddGroupScreen = (props) => {
  const appStyles = props?.route?.params?.appStyles;
  const colorScheme = useColorScheme();
  const currentTheme = appStyles?.navThemeConstants[colorScheme];

  const friends = useSelector((state) => state.friends.friends);
  const currentUser = useSelector((state) => state.auth.user);

  const [isNameDialogVisible, setIsNameDialogVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [uiFriends, setUiFriends] = useState(null);

  useLayoutEffect(() => {
    console.log("props==>", props.route.params.title)
    props.navigation.setOptions({
      headerTitle: IMLocalized('Choose People'),
      headerRight:
        friends.length > 1
          ? () => (
            <TextButton style={{ marginHorizontal: 7 }} onPress={props.route.params.title == "Create" ? onCreate : onADD}>
              {IMLocalized(props?.route.params.title)}
            </TextButton>
          )
          : () => <View />,



      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
  }, [friends]);

  useEffect(() => {
    setUiFriends(friends);
  }, [friends]);

  useEffect(() => {
    const didFocusSubscription = props.navigation.addListener('focus', (payload) =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    );

    const willBlurSubscription = props.navigation.addListener(
      'beforeRemove',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        ),
    );
    return () => {
      didFocusSubscription && didFocusSubscription();
      willBlurSubscription && willBlurSubscription();
    };
  }, []);

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();
    return true;
  };


  const onADD = (friend) => {
    let channelJson = props?.route.params.channel;
    
    const participants = friends.filter((friend) => friend.checked);
    channelManager
      .AddMembersToChannel(channelJson, participants)
      .then((response) => {
        if (response.success == true) {
          props.navigation.goBack();

          // Alert.alert(
          //   "Success!",
          //   "Participant added successfully.",
          //   [
          //     { text: "Ok", onPress: () => { 
          //       onCancel();
          //       props.navigation.goBack(); } }
          //   ]
          // );
        }
      });
  }


  const onCreate = () => {
    const checkedFriends = friends.filter((friend) => friend.checked);
    if (checkedFriends.length === 0) {
      alert('Please choose at least two friends.');
    } else {
      setIsNameDialogVisible(true);
    }
  };

  const onCheck = (friend) => {
    friend.checked = !friend.checked;
    const newFriends = friends.map((item) => {
      if (item.id == friend.id) {
        return friend;
      }
      return item;
    });
    setUiFriends(newFriends);
  };

  const onCancel = () => {
    setGroupName('');
    setIsNameDialogVisible(false);
    setUiFriends(friends);
  };

  const onSubmitName = (name) => {
    const participants = friends.filter((friend) => friend.checked);
    if (participants.length < 2) {
      alert(IMLocalized('Choose at least 2 friends to create a group.'));
      return;
    }
    channelManager
      .createChannel(currentUser, participants, name)
      .then((response) => {
        if (response.success == true) {
          onCancel();
          props.navigation.goBack();
        }
      });
  };

  const onEmptyStatePress = () => {
    props.navigation.goBack();
  };

  return (
    <IMAddGroupComponent
      onCancel={onCancel}
      isNameDialogVisible={isNameDialogVisible}
      friends={uiFriends}
      onSubmitName={onSubmitName}
      onCheck={onCheck}
      appStyles={appStyles}
      onEmptyStatePress={onEmptyStatePress}
      channel={props?.route.params.channel}
    />
  );
};

export default IMAddGroupScreen;
