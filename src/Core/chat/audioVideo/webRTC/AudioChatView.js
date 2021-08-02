import React, { useState } from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements';

const HEIGHT = Dimensions.get('window').height;
const Image = FastImage;
const controlIconSize = HEIGHT * 0.063;

const assets = {
  phoneCall: require('../../assets/phone-call.png'),
  endCall: require('../../assets/end-call.png'),
  microphone: require('../../assets/microphone.png'),
  speaker: require('../../assets/speaker.png'),
  share: require('../../assets/send.png'),
};

const AudioChatView = (props) => {
  const {
    audioVideoChatReceivers,
    remoteStreams,
    hoursCounter,
    minutesCounter,
    secondsCounter,
    isComInitiated,
    isSpeaker,
    isMuted,
    isScreenShare,
    toggleSpeaker,
    endCall,
    shareScreen,
    onAcceptCall,
    toggleMute,
    initialCallState,
    channelTitle,
  } = props;

  let fullName = channelTitle;

  const [backgroundBlurImage] = useState(
    audioVideoChatReceivers[0]?.profilePictureURL,
  );
  const [chatReceivers] = useState(audioVideoChatReceivers);

  if (!channelTitle) {
    fullName = `${audioVideoChatReceivers[0]?.firstName} ${audioVideoChatReceivers[0]?.lastName}`;
  }

  const renderTimer = () => {
    let timer = `${minutesCounter} : ${secondsCounter}`;
    if (Number(hoursCounter) > 0) {
      timer = `${hoursCounter} : ${minutesCounter} : ${secondsCounter}`;
    }
    return <Text style={styles.timer}>{timer}</Text>;
  };

  const renderUserAvatartop = (receiver, index) => {
    const isMultiAvatar = audioVideoChatReceivers.length > 2;
    console.log(index);
    if (index == 0) {
      return (
        <View
          key={index + ''}
          style={[
            styles.profilePictureContainer,
            index === 0 && isMultiAvatar && styles.profilePictureContainerCenter,
            ]}>
          <Image
            source={{ uri: receiver.profilePictureURL }}
            style={styles.profilePicture}
          />
        </View>
      );
    }
  };

  const renderUserAvatar2 = (receiver, index) => {
    const isMultiAvatar = audioVideoChatReceivers.length > 2;
    console.log(index);
    if (index < 3) {
      if(index == 0) return;
      return (
        <View
          key={index + ''}
          style={[
            styles.profilePictureContainer,
            index === 1 && isMultiAvatar && styles.profilePictureContainerLeft,
            index === 2 && isMultiAvatar && styles.profilePictureContainerRight,
          ]}>
          <Image
            source={{ uri: receiver.profilePictureURL }}
            style={styles.profilePicture}
          />
        </View>
      );
    }
  };

  const renderUserAvatar3 = (receiver, index) => {
    const isMultiAvatar = audioVideoChatReceivers.length > 2;
    console.log(index);
    if (index > 3) {
      if(index < 3) return;
      return (
        <View
          key={index + ''}
          style={[
            styles.profilePictureContainer,
            index > 3 && isMultiAvatar && styles.profilePictureContainerCenter2,
          ]}>
          <Image
            source={{ uri: receiver.profilePictureURL }}
            style={styles.profilePicture}
          />
        </View>
      );
    }
  };

  return (
    <Image
      blurRadius={20}
      source={{ uri: backgroundBlurImage }}
      style={styles.imageBackground}>
      <BlurView tint={'dark'} intensity={100} style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.receiverAvatarContainer}>
            {chatReceivers.map((receiver, index) =>
              renderUserAvatartop(receiver, index),
            )}
          </View>

          <Text style={styles.userName}>{fullName}</Text>
          {remoteStreams ? (
            renderTimer()
          ) : (
            <Text style={styles.timer}>{initialCallState}</Text>
          )}          
        </View>

        <View style={styles.profileContainer2}>
          <View style={styles.receiverAvatarContainer2}>
            {chatReceivers.map((receiver, index) =>
              renderUserAvatar2(receiver, index),
            )}
          </View>         
        </View>


        <View style={styles.control2}>
          <View style={styles.profileContainer}>
            <View style={styles.receiverAvatarContainer}>
              {chatReceivers.map((receiver, index) =>
                renderUserAvatar3(receiver, index),
              )}
            </View>         
          </View>         
        </View>

      
        <View style={styles.control}>
          <TouchableOpacity
            onPress={toggleSpeaker}
            style={[
              styles.controlIconContainer,
              isSpeaker && { backgroundColor: 'transparent' },
            ]}
            >
            {/* <Image
              source={assets.speaker}
              style={[styles.imageIcon, isSpeaker && { tintColor: '#fff' }]}
            /> */}
            {isSpeaker && (
              <Icon name="volume-x" type="feather" size={controlIconSize / 2} color="white" />
            )}
            {!isSpeaker && (
              <Icon name="volume-2" type="feather" size={controlIconSize / 2} color="white" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={toggleMute}
            style={[
              styles.controlIconContainer,
              isMuted && { backgroundColor: 'transparent' },
            ]}>
            {/* <Image
              source={assets.microphone}
              style={[styles.imageIcon, isMuted && { tintColor: '#fff' }]}
            /> */}
            {isMuted && (
              <Icon name="mic-off" type="feather" size={controlIconSize / 2}
                    color="white"
                    style={[styles.imageIcon]} 
              />
            )}
            {!isMuted && (
              <Icon name="mic" type="feather" size={controlIconSize / 2}
                    color="white"
                    style={[styles.imageIcon]} 
              />
            )}            
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlIconContainer,
              { backgroundColor: 'transparent' },
            ]}
            onPress={shareScreen}>
            {/* <Image source={assets.share} style={styles.imageIcon} /> */}         
            {isScreenShare && (
              <Icon name="monitor-share" type="material-community" size={controlIconSize / 2} color="white" />
            )}
            {!isScreenShare && (
              <Icon name="monitor-share" type="material-community" size={controlIconSize / 2} color="white" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlIconContainer,
              { backgroundColor: 'transparent' },
            ]}
            onPress={endCall}>
            {/* <Image source={assets.endCall} style={styles.imageIcon} /> */}
            <Icon name="phone-off" type="feather"  size={controlIconSize / 2} color="white" />
          </TouchableOpacity>


          {!isComInitiated && (
            <TouchableOpacity
              style={[
                styles.controlIconContainer,
                { backgroundColor: '#6abd6e' },
              ]}
              onPress={onAcceptCall}>
              {/* <Image source={assets.phoneCall} style={styles.imageIcon} /> */}
              <Icon name="phone-incoming" type="feather"  size={controlIconSize / 2} color="white" />
            </TouchableOpacity>
          )}
        </View>
      
      </View>
    </Image>
  );
};

export default AudioChatView;
