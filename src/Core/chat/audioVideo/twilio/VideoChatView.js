import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements';
import { BlurView } from 'expo-blur';

const Image = FastImage;

const HEIGHT = Dimensions.get('window').height;
const controlIconSize = HEIGHT * 0.063;

const assets = {
  phoneCall: require('../../assets/phone-call.png'),
  endCall: require('../../assets/end-call.png'),
  microphone: require('../../assets/microphone.png'),
  speaker: require('../../assets/speaker.png'),
};

const VideoChatView = (props) => {
  const {
    isComInitiated,
    isMuted,
    isSpeaker,
    toggleSpeaker,
    toggleMute,
    endCall,
    onAcceptCall,
    videoTracks,
    isCallAccepted,
    gobacktoChat,
    switchCamera,
  } = props;

  const [largeFillingRtcContainer, setLargeFillingRtcContainer] = useState(
    styles.largeFillingRtcContainer,
  );
  useEffect(()=>{
    settracks([...videoTracks])
  },[videoTracks])
  const [tracks, settracks] = useState([]
    
  );
  const [
    singleSmallLocalRtcContainer,
    setSingleSmallLocalRtcContainer,
  ] = useState([styles.singleSmallLocalRtcContainer]);
  const [isLocalLargeContainer, setIsLocalLargeContainer] = useState(false);
  const isNotGroupStream = videoTracks;

  const switchStreams = () => {
    const oldLargeFillingRtcContainer = largeFillingRtcContainer;
    const oldSingleSmallLocalRtcContainer = singleSmallLocalRtcContainer;

    if (isNotGroupStream) {
      setLargeFillingRtcContainer(oldSingleSmallLocalRtcContainer);
      setSingleSmallLocalRtcContainer(oldLargeFillingRtcContainer);
      setIsLocalLargeContainer(
        (isLocalLargeContainer) => !isLocalLargeContainer,
      );
    }
  };
const switchStreamsRemoteStreams =(i)=>{
  // alert(i)

  let arr = tracks
  var obj = arr[i]
  arr.splice(i,1)
  arr.unshift(obj)
  settracks([...arr])
  // tracks

}
  const renderRemoteStreams = ([trackSid, trackIdentifier], i) => {
    { console.log({ trackSid, trackIdentifier, te: "ssssssssssssssssssssssssssss", index: i, flag: isNotGroupStream ? true : false }) }
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          switchStreamsRemoteStreams(i);
          // if (isLocalLargeContainer) {
            
          //   console.log({ isLocalLargeContainer })
          // }
        }}
        key={trackSid}
        style={

          i === 0
            ? largeFillingRtcContainer
            : styles.groupSmallLocalRtcContainer
        }>
        <TwilioVideoParticipantView
          style={styles.rtcStream}
          key={trackSid}
          trackIdentifier={trackIdentifier}
        />
      </TouchableOpacity>
    );
  };

  const renderStreamOne = (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        switchStreams();
        if (!isLocalLargeContainer) {
         
        }
      }}
      style={
        isNotGroupStream
          ? singleSmallLocalRtcContainer
          :
          [largeFillingRtcContainer]
      }>
      <TwilioVideoLocalView enabled={true} style={styles.rtcStream} />
    </TouchableOpacity>
  );

  const renderStreamTwo = tracks && (
    // console.log({tracks})
    <View
      style={
        isNotGroupStream
          ? {
            position: 'relative',
            width: '100%',
            height: '100%',
          }
          : styles.remoteStreamsContainer
      }>
      {console.log({ tracks, isNotGroupStream })}
      {

        tracks.map((data, i) => {
          console.log({ data, i })
          return renderRemoteStreams(data, i)
        })



      }
    </View>
  );

  const renderStreams = () => {
    console.log({ isLocalLargeContainer })
    if (isLocalLargeContainer) {
      return (
        <>
          {renderStreamOne}
          {renderStreamTwo}
        </>
      );
    } else {
      return (
        <>
          {renderStreamTwo}
          {renderStreamOne}
        </>
      );
    }
  };

  return (
    <>
      {renderStreams()}
      <View style={styles.control}>
        <TouchableOpacity
          onPress={toggleSpeaker}
          style={[
            styles.controlIconContainer,
            isSpeaker && { backgroundColor: '#5b5b5c' },
          ]}>
          <Image
            source={assets.speaker}
            style={[styles.imageIcon, isSpeaker && { tintColor: '#fff' }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleMute}
          style={[
            styles.controlIconContainer,
            isMuted && { backgroundColor: '#5b5b5c' },
          ]}>
          <Image
            source={assets.microphone}
            style={[styles.imageIcon, isMuted && { tintColor: '#fff' }]}
          />
        </TouchableOpacity>


        {isCallAccepted && (
          <TouchableOpacity
            style={[
              styles.controlIconContainer,
              { backgroundColor: '#fff' },
            ]}
            onPress={gobacktoChat}>
            <Icon name="message-square" type="feather" size={controlIconSize / 2} color="black" />
          </TouchableOpacity>
        )}

        {isCallAccepted && (
          <TouchableOpacity
            style={[
              styles.controlIconContainer,
              { backgroundColor: '#fff' },
            ]}
            onPress={switchCamera}>
            <Icon name="refresh-ccw" type="feather" size={controlIconSize / 2} color="black" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlIconContainer, { backgroundColor: '#fc2e50' }]}
          onPress={endCall}>
          <Image source={assets.endCall} style={styles.imageIcon} />
        </TouchableOpacity>
        {!isComInitiated && (
          <TouchableOpacity
            style={[
              styles.controlIconContainer,
              { backgroundColor: '#6abd6e' },
            ]}
            onPress={onAcceptCall}>
            <Image source={assets.phoneCall} style={styles.imageIcon} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default VideoChatView;
