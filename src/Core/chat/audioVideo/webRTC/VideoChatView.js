import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View,
  Dimensions } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements';

const HEIGHT = Dimensions.get('window').height;
const controlIconSize = HEIGHT * 0.063;

const Image = FastImage;

const assets = {
  phoneCall: require('../../assets/phone-call.png'),
  endCall: require('../../assets/end-call.png'),
  microphone: require('../../assets/microphone.png'),
  speaker: require('../../assets/speaker.png'),
};

const VideoChatView = (props) => {
  const {
    remoteStreams,
    localStream,
    isComInitiated,
    peerConnectionStarted,
    isMuted,
    isSpeaker,
    isScreenShare,
    toggleSpeaker,
    toggleMute,
    endCall,
    shareScreen,
    onAcceptCall,
  } = props;

  const newRemoteStreams = remoteStreams && Object.keys(remoteStreams);
  const [currentRemoteStreams, setCurrentRemoteStreams] = useState([]);
  const [currentLocalStream, setCurrentLocalStream] = useState(localStream);
  const [largeFillingRtcContainer, setLargeFillingRtcContainer] = useState(
    styles.largeFillingRtcContainer,
  );
  const [
    singleSmallLocalRtcContainer,
    setSingleSmallLocalRtcContainer,
  ] = useState([styles.singleSmallLocalRtcContainer]);
  const [isLocalLargeContainer, setIsLocalLargeContainer] = useState(false);
  const isNotGroupStream = newRemoteStreams.length === 1;

  useEffect(() => {
    const generatedRemoteStreams =
      newRemoteStreams &&
      newRemoteStreams.map((stream) => {
        return remoteStreams[stream];
      });
    setCurrentRemoteStreams(generatedRemoteStreams);
    setCurrentLocalStream(localStream);
  }, [remoteStreams]);

  const switchStreams = (stream, index) => {
    const oldLocalStream = currentLocalStream;
    const oldRemoteStreams = [...currentRemoteStreams];
    const oldLargeFillingRtcContainer = largeFillingRtcContainer;
    const oldSingleSmallLocalRtcContainer = singleSmallLocalRtcContainer;

    if (isNotGroupStream) {
      setLargeFillingRtcContainer(oldSingleSmallLocalRtcContainer);
      setSingleSmallLocalRtcContainer(oldLargeFillingRtcContainer);
      setIsLocalLargeContainer(
        (isLocalLargeContainer) => !isLocalLargeContainer,
      );
    } else {
      oldRemoteStreams[index] = oldLocalStream;
      setCurrentRemoteStreams(oldRemoteStreams);
      setCurrentLocalStream(stream);
    }
  };

  const renderRemoteStreams = (remoteStream, index) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (!isNotGroupStream) {
            switchStreams(remoteStream, index);
          }

          if (isLocalLargeContainer) {
            switchStreams(remoteStream, index);
          }
        }}
        key={index + ''}
        style={
          isNotGroupStream
            ? largeFillingRtcContainer
            : styles.groupSmallLocalRtcContainer
        }>
        <RTCView
          style={styles.rtcStream}
          // objectFit={'contain'}
          objectFit={'cover'}
          zOrder={isLocalLargeContainer ? 2 : 1}
          streamURL={remoteStream.toURL()}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* Small View Set */}
      {localStream && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (!isLocalLargeContainer && isNotGroupStream) {
              switchStreams();
            }
          }}
          style={
            isNotGroupStream
              ? singleSmallLocalRtcContainer
              : [largeFillingRtcContainer]
          }>
          <RTCView
            style={styles.rtcStream}
            mirror={true}
            objectFit={'cover'}
            zOrder={isLocalLargeContainer ? 1 : 2}
            streamURL={currentLocalStream.toURL()}
          />
        </TouchableOpacity>
      )}

      {/* Background View set */}
      {remoteStreams && (
        <View
          style={
            isNotGroupStream
              ? {
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  zIndex: 0,
                }
              : styles.remoteStreamsContainer
          }>
          {currentRemoteStreams.map((remoteStream, index) =>
            renderRemoteStreams(remoteStream, index),
          )}
        </View>
      )}
    
    
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
      
    </>
  );
};

export default VideoChatView;
