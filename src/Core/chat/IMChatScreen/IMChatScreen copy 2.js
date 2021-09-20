import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Platform, Alert, BackHandler, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import ImagePicker from 'react-native-image-crop-picker';
import { IMIconButton } from '../../truly-native';
import IMChat from '../IMChat/IMChat';
import { channelManager } from '../firebase';
import { firebaseStorage } from '../../firebase/storage';
import { reportingManager } from '../../user-reporting';
import { IMLocalized } from '../../localization/IMLocalization';
import { notificationManager } from '../../notifications';
import {
  IMAudioVideoChat,
  sendCallInitiationRemoteNotification,
  setMediaChatReceivers,
  setMediaChatData,
} from '../audioVideo';
import DocumentPicker from 'react-native-document-picker'
import { firebase } from '../../firebase/config';
import storage from '@react-native-firebase/storage';
import CryptoJS from "react-native-crypto-js";
const IMChatScreen = (props) => {
  const appStyles = props.route.params.appStyles;
  const colorScheme = useColorScheme();
  const currentTheme = appStyles.navThemeConstants[colorScheme];

  const openedFromPushNotification =
    props.route.params.openedFromPushNotification;
  const navigation = props.navigation;

  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [channel, setChannel] = useState(null);
  const [thread, setThread] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [downloadObject, setDownloadObject] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [isRenameDialogVisible, setIsRenameDialogVisible] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(-1);
  const [inReplyToItem, setInReplyToItem] = useState(null);
  const [images, setImages] = useState([]);

  const threadUnsubscribe = useRef(null);
  const singleChannelUnsubscribe = useRef(null);

  const groupSettingsActionSheetRef = useRef(null);
  const privateSettingsActionSheetRef = useRef(null);

  const [willBlur, setWillBlur] = useState(false);
  const willBlurSubscription = useRef(null);
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) => {
      setWillBlur(false);
    }),
  );

  useLayoutEffect(() => {
    if (!openedFromPushNotification) {
      configureNavigation(
        channelWithHydratedOtherParticipants(props.route.params.channel),
      );
    } else {
      navigation.setOptions({ headerTitle: '' });
    }
  }, [navigation]);

  useEffect(() => {
    configureNavigation(channel);
  }, [channel]);

  useEffect(() => {
    if (thread) {
      configureImages();
    }
  }, [thread]);

  useEffect(() => {
    if (selectedMediaIndex !== -1) {
      setIsMediaViewerOpen(true);
    } else {
      setIsMediaViewerOpen(false);
    }
  }, [selectedMediaIndex]);

  useEffect(() => {
    const hydratedChannel = channelWithHydratedOtherParticipants(
      props.route.params.channel,
    );
    if (!hydratedChannel) {
      return;
    }
    setChannel(hydratedChannel);

    threadUnsubscribe.current = channelManager.subscribeThreadSnapshot(
      hydratedChannel,
      onThreadCollectionUpdate,
    );
    singleChannelUnsubscribe.current = channelManager.subscribeSingleChannel(
      hydratedChannel.id,
      (doc) => {
        onRemoteChannelRetrieved(doc?.data());
      },
    );
  }, [currentUser?.id]);

  useEffect(() => {
    willBlurSubscription.current = props.navigation.addListener(
      'blur',
      (payload) => {
        setWillBlur(true);
      },
    );
    return () => {
      willBlurSubscription.current && willBlurSubscription.current();
      didFocusSubscription.current && didFocusSubscription.current();
    };
  }, []);

  useEffect(() => {
    if (downloadObject !== null) {
      // We've just finished the photo upload, so we send the message out
      setUploadProgress(0);
      onSendInput();
    }
  }, [downloadObject]);

  useEffect(() => {
    if (willBlur) {
      threadUnsubscribe.current && threadUnsubscribe.current();
      singleChannelUnsubscribe.current && singleChannelUnsubscribe.current();
    }
    BackHandler.addEventListener('hardwareBackPress', onBackButtonPressAndroid);
  }, [willBlur]);

  const configureNavigation = (channel) => {
    var title = channel?.name;
    var isGroupChat = channel?.otherParticipants?.length > 1;
    if (!title && channel?.otherParticipants?.length > 0) {
      title =
        channel.otherParticipants[0]?.firstName +
        ' ' +
        channel.otherParticipants[0]?.lastName ||
        channel.otherParticipants[0]?.fullname;
    }

    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={() =>
          props.navigation.navigate('GroupDetails', { title: title, channel: channel })
          // console.log(JSON.stringify(channel, null, 2))
        }>
          <Text style={{ color: 'white', textAlign: 'left', fontSize: 18 }}>{title || props.route.params.title || IMLocalized('Chat')}
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerBackTitleVisible: false,
      headerTitleStyle: isGroupChat
        ? {
          width: Dimensions.get('window').width - 110,
        }
        : null,
      headerTintColor: currentTheme.fontColor,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IMIconButton
            source={require('../assets/settings-icon.png')}
            tintColor={appStyles.styleSet.backArrowStyle.tintColor}
            onPress={onSettingsPress}
            marginRight={15}
            width={20}
            height={20}
          />
          <IMIconButton
            source={require('../assets/call.png')}
            tintColor={appStyles.styleSet.backArrowStyle.tintColor}
            onPress={onAudioChat}
            marginRight={15}
            width={20}
            height={20}
          />
          <IMIconButton
            source={require('../assets/video-camera-filled.png')}
            tintColor={appStyles.styleSet.backArrowStyle.tintColor}
            onPress={onVideoChat}
            marginRight={15}
            width={20}
            height={20}
          />
        </View>
      ),
    });
  };

  const onRemoteChannelRetrieved = (remoteChannel) => {
    if (!remoteChannel) {
      return;
    }
    // We have a hydrated channel, so we replace the partial channel we have on the state
    const hydratedChannel = channelWithHydratedOtherParticipants(remoteChannel);
    setChannel(hydratedChannel);
    markThreadItemAsReadIfNeeded(hydratedChannel);

    // We have a hydrated channel, so we update the title of the screen
    if (openedFromPushNotification) {
      configureNavigation(hydratedChannel);
    }
  };

  const channelWithHydratedOtherParticipants = (channel) => {
    const allParticipants = channel?.participants;
    if (!allParticipants) {
      return channel;
    }
    // otherParticipants are all the participants in the chat, except for the currently logged in user
    const otherParticipants =
      allParticipants &&
      allParticipants.filter(
        (participant) => participant && participant.id != currentUser.id,
      );
    return { ...channel, otherParticipants };
  };

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();
    return true;
  };

  const onVideoChat = () => {
    if (channel?.otherParticipants) {
      dispatch(setMediaChatData({ status: 'initiated' }));
      dispatch(
        setMediaChatReceivers({
          receivers: channel.otherParticipants,
          channelId: channel.id,
          channelTitle: channel.name || '',
          type: 'video',
        }),
      );

      IMAudioVideoChat.showVideoChatModal();
      sendCallInitiationRemoteNotification(
        currentUser,
        channel?.otherParticipants,
        'video',
        channel.id,
        channel.name,
      );
    }
  };

  const onAudioChat = () => {
    if (channel?.otherParticipants) {
      dispatch(setMediaChatData({ status: 'initiated' }));
      dispatch(
        setMediaChatReceivers({
          receivers: channel.otherParticipants,
          channelId: channel.id,
          channelTitle: channel.name || '',
          type: 'audio',
        }),
      );
      IMAudioVideoChat.showAudioChatModal();
      sendCallInitiationRemoteNotification(
        currentUser,
        channel?.otherParticipants,
        'audio',
        channel.id,
        channel.name,
      );
    }
  };

  const onSettingsPress = () => {
    if (channel?.otherParticipants?.length > 1) {
      groupSettingsActionSheetRef.current.show();
    } else {
      privateSettingsActionSheetRef.current.show();
    }
  };

  const onChangeName = (text) => {
    showRenameDialog(false);

    const channel = { ...channel };
    channel.name = text;

    channelManager.onRenameGroup(
      text,
      channel,
      ({ success, error, newChannel }) => {
        if (success) {
          setChannel(newChannel);
          configureNavigation(newChannel);
        }
        if (error) {
          alert(error);
        }
      },
    );
  };

  const onLeave = () => {
    Alert.alert(
      IMLocalized(`Leave ${channel?.name ?? 'group'}`),
      IMLocalized('Are you sure you want to leave this group?'),
      [
        {
          text: 'Yes',
          onPress: onLeaveDecided,
          style: 'destructive',
        },
        { text: 'No' },
      ],
      { cancelable: false },
    );
  };

  const onLeaveDecided = () => {
    channelManager.onLeaveGroup(
      channel.id,
      currentUser.id,
      ({ success, error }) => {
        if (success) {
          navigation.goBack(null);
        }
        if (error) {
          alert(error);
        }
      },
    );
  };

  const showRenameDialog = (show) => {
    setIsRenameDialogVisible(show);
  };

  const markThreadItemAsReadIfNeeded = (channel) => {
    const {
      id: channelID,
      lastThreadMessageId,
      readUserIDs,
      participants,
      lastMessage,
    } = channel;
    const userID = currentUser?.id;
    const isRead = readUserIDs?.includes(userID);
    if (!isRead && channelID && lastMessage && userID) {
      const newReadUserIDs = readUserIDs ? [...readUserIDs, userID] : [userID];
      channelManager.markChannelThreadItemAsRead(
        channelID,
        userID,
        lastThreadMessageId,
        newReadUserIDs,
        participants,
      );
    }
  };

  const onThreadCollectionUpdate = (querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      let bytes = CryptoJS.AES.decrypt(doc.data().content, 'secretkey123');
      let decrypt = bytes.toString(CryptoJS.enc.Utf8);
      let obj = doc.data()
      obj["content"] = decrypt
      const message = obj;
      console.log({ message, doc: doc.data(), decrypt })
      data.push({ ...message, id: doc.id });
    });
    setThread(data);
  };

  const onChangeTextInput = (text) => {
    setInputValue(text);
  };

  const createOne2OneChannel = () => {
    return new Promise((resolve) => {
      channelManager
        .createChannel(currentUser, channel?.otherParticipants)
        .then((response) => {
          if (!response.channel) {
            return;
          }
          setChannel(channelWithHydratedOtherParticipants(response.channel));
          threadUnsubscribe.current && threadUnsubscribe.current();
          threadUnsubscribe.current = channelManager.subscribeThreadSnapshot(
            response.channel,
            onThreadCollectionUpdate,
          );
          resolve();
        });
    });
  };

  const onSendInput = async () => {
    if (thread?.length > 0 || channel?.otherParticipants?.length > 1) {
      sendMessage();
      return;
    }

    // If we don't have a chat message, we need to create a 1-1 channel first
    createOne2OneChannel().then(() => {
      sendMessage();
    });
  };

  const getParticipantPictures = () => {
    if (channel?.otherParticipants) {
      return channel.otherParticipants.map((participant) => {
        return {
          participantId: participant.id || participant.userID,
          profilePictureURL: participant.profilePictureURL,
        };
      });
    } else {
      return [];
    }
  };

  const sendMessage = () => {
    const tempInputValue = inputValue;
    const tempInReplyToItem = inReplyToItem;
    const participantProfilePictureURLs = getParticipantPictures();
    setInputValue('');
    setInReplyToItem(null);

    channelManager
      .sendMessage(
        currentUser,
        channel,
        tempInputValue,
        downloadObject,
        tempInReplyToItem,
        participantProfilePictureURLs,
      )
      .then((response) => {
        if (response.error) {
          alert(error);
          setInputValue(tempInputValue);
          setInReplyToItem(tempInReplyToItem);
        } else {
          setDownloadObject(null);
          broadcastPushNotifications(tempInputValue, downloadObject);
        }
      });
  };

  const broadcastPushNotifications = (inputValue, downloadObject) => {
    const participants = channel.otherParticipants;
    if (!participants || participants.length == 0) {
      return;
    }
    const sender = currentUser;
    const isGroupChat = channel.name && channel.name.length > 0;
    const fromTitle = isGroupChat
      ? channel.name
      : sender.firstName + ' ' + sender.lastName;
    var message;
    if (isGroupChat) {
      if (downloadObject) {
        if (
          downloadObject.mime &&
          downloaddownloadObjectURL.mime.startsWith('video')
        ) {
          message =
            sender.firstName +
            ' ' +
            sender.lastName +
            ' ' +
            IMLocalized('sent a video.');
        } else {
          message =
            sender.firstName +
            ' ' +
            sender.lastName +
            ' ' +
            IMLocalized('sent a photo.');
        }
      } else {
        message = sender.firstName + ' ' + sender.lastName + ': ' + inputValue;
      }
    } else {
      if (downloadObject) {
        if (downloadObject.mime && downloadObject.mime.startsWith('video')) {
          message = sender.firstName + ' ' + IMLocalized('sent you a video.');
        } else if (
          downloadObject.mime &&
          downloadObject.mime.startsWith('audio')
        ) {
          message =
            sender.firstName + ' ' + IMLocalized('sent you an audio message.');
        } else {
          message = sender.firstName + ' ' + IMLocalized('sent you a photo.');
        }
      } else {
        message = inputValue;
      }
    }

    participants.forEach((participant) => {
      if (participant.id !== currentUser.id) {
        notificationManager.sendPushNotification(
          participant,
          fromTitle,
          message,
          'chat_message',
          { channelID: channel.id },
        );
      }
    });
  };
  
  const onAddMediaPress = (photoUploadDialogRef) => {
    photoUploadDialogRef.current.show();
  };

  const onAddAttachmentPress = async  () => {
    alert()
    try {
      const res = await DocumentPicker.pick(
        {
        type: [
          DocumentPicker.types.audio,
      
          DocumentPicker.types.pdf,
          DocumentPicker.types.zip,
          DocumentPicker.types.csv,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
          ],
      }
      
      )


      // const blob = await getPathForFirebaseStorage(res[0].uri);
      const destPath = `${RNFS.TemporaryDirectoryPath}/${uniqueId()}`
      await RNFS.copyFile(res[0].uri, destPath)
      const pathUri = await RNFS.stat(destPath)

      console.log({ destPath: await RNFS.stat(destPath) })
      // console.log(
      //   {
      //     res, blob
      //   }
      // )

      const id = uniqueId()
      var reference = storage().ref(`chatDoc/${channelItem.id}/${id}`);
      await reference.putFile(pathUri.path);
      const path = await storage().ref(`chatDoc/${channelItem.id}/${id}`).getDownloadURL();
      let obj = {
        path,
        storageRef: `chatDoc/${channelItem.id}/${id}}`,

      };

      console.log(
        {
          obj
        }
      )

      // const filename = processedUri.substring(processedUri.lastIndexOf('/') + 1);
      // const blob = await getBlob(processedUri);
      // const storageRef = firebase.storage().ref();
      // const fileRef = storageRef.child(filename);
      // const uploadTask = fileRef.put(blob);








      // console.log(
      //   {
      //     type: res[0].type,
      //     name: res[0].name,
      //     obj,
      //     res,
      //     channelItem
      //   }
      // )
    } catch (err) {
      console.log({ err })
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {

        throw err
      }
    }

    // Pick multiple files

  }

  const onAudioRecordSend = (audioRecord) => {
    startUpload(audioRecord);
  };

  const onLaunchCamera = () => {
    const { id, firstName, profilePictureURL } = currentUser;

    ImagePicker.openCamera({
      cropping: false,
    })
      .then((image) => {
        startUpload(image);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onOpenPhotos = () => {
    const { id, firstName, profilePictureURL } = currentUser;

    ImagePicker.openPicker({
      cropping: false,
      multiple: false,
    })
      .then((image) => {
        startUpload(image);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const startUpload = (uploadData) => {
    const { mime } = uploadData;

    firebaseStorage.uploadFileWithProgressTracking(
      uploadData,
      async (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(uploadProgress);
      },
      async (url) => {
        if (url) {
          setDownloadObject({
            ...uploadData,
            source: url,
            uri: url,
            url,
            mime,
          });
        }
      },
      (error) => {
        setUploadProgress(0);
        alert(IMLocalized('Oops! An error has occurred. Please try again.'));
        console.log(error);
      },
    );
  };

  const configureImages = () => {
    var images = [];

    thread?.forEach((item) => {
      if (item && item.url && item.url !== '') {
        if (item.url.mime && item.url.mime.startsWith('image')) {
          images.push({
            id: item.id,
            url: item.url,
          });
        } else if (!item.url.mime && item.url.startsWith('https://')) {
          // To handle old format before video feature
          images.push({
            id: item.id,
            url: item.url,
          });
        }
      }
    });
    setImages(images);
  };

  const onChatMediaPress = (item) => {
    const index = images?.findIndex((image) => {
      return image.id === item.id;
    });
    setSelectedMediaIndex(index);
  };

  const onMediaClose = () => {
    setSelectedMediaIndex(-1);
  };

  const onUserBlockPress = () => {
    reportAbuse('block');
  };

  const onUserReportPress = () => {
    reportAbuse('report');
  };

  const reportAbuse = (type) => {
    const participants = channel?.otherParticipants;
    if (!participants || participants.length != 1) {
      return;
    }
    const myID = currentUser.id;
    const otherUserID = participants[0].id;
    reportingManager.markAbuse(myID, otherUserID, type).then((response) => {
      if (!response.error) {
        navigation.goBack(null);
      }
    });
  };

  const onReplyActionPress = (inReplyToItem) => {
    setInReplyToItem(inReplyToItem);
  };

  const onReplyingToDismiss = () => {
    setInReplyToItem(null);
  };

  const onDeleteThreadItem = (threadItem) => {
    let newLastCreatedThreadItem = null;
    let isLastCreatedThreadItem = false;

    if (thread.length > 0 && thread[0].id === threadItem?.id) {
      isLastCreatedThreadItem = true;
      newLastCreatedThreadItem = thread[1];
    }

    const params = {
      isLastCreatedThreadItem,
      newLastCreatedThreadItem,
      channel,
      sender: currentUser,
      threadItemID: threadItem?.id,
    };

    channelManager.deleteMessage(params);
  };

  return (
    <IMChat
      appStyles={appStyles}
      user={currentUser}
      thread={thread}
      inputValue={inputValue}
      inReplyToItem={inReplyToItem}
      onAddAttachmentPress={onAddAttachmentPress}
      onAddMediaPress={onAddMediaPress}
      
      onSendInput={onSendInput}
      onAudioRecordSend={onAudioRecordSend}
      onChangeTextInput={onChangeTextInput}
      onLaunchCamera={onLaunchCamera}
      onOpenPhotos={onOpenPhotos}
      uploadProgress={uploadProgress}
      mediaItemURLs={images.flatMap((i) => i.url?.url)}
      isMediaViewerOpen={isMediaViewerOpen}
      selectedMediaIndex={selectedMediaIndex}
      onChatMediaPress={onChatMediaPress}
      onMediaClose={onMediaClose}
      isRenameDialogVisible={isRenameDialogVisible}
      groupSettingsActionSheetRef={groupSettingsActionSheetRef}
      privateSettingsActionSheetRef={privateSettingsActionSheetRef}
      showRenameDialog={showRenameDialog}
      onChangeName={onChangeName}
      onLeave={onLeave}
      onUserBlockPress={onUserBlockPress}
      onUserReportPress={onUserReportPress}
      onReplyActionPress={onReplyActionPress}
      onReplyingToDismiss={onReplyingToDismiss}
      onDeleteThreadItem={onDeleteThreadItem}
      channelItem={channel}
    />
  );
};

export default IMChatScreen;
