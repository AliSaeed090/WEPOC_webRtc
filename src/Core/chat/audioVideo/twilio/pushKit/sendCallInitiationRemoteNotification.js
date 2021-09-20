import { notificationManager } from '../../../../notifications';
import { callID, pushKitEndpoint, iOSBundleID } from '../../../config';

export const sendCallInitiationRemoteNotification = (
  caller,
  recipients,
  callType,
  channelID,
  channelName,
) => {
  console.log("Push Notificationssssssssssssssssssssssssssssssssssssssssss")
  // We send a push kit notification (in case the recipients are on iOS)
  const data = {
    callerID: caller.id,
    recipientIDs: recipients.map((recipient) => recipient.id),
    callType,
    channelID,
    channelName,
    topic: iOSBundleID,
    uuid: callID,
  };

  fetch(pushKitEndpoint, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(data),
  }).then(function(response) {
    response.text().then(function(text) {
     console.log({response, text})
    });
  }).catch((err)=>{
    console.log({notificationErr:err})
  })

  console.log('ttttt push kit ' + JSON.stringify(data));


  // We send a push notification (in case the recipients are on Android)
  recipients.forEach((recipient) => {
    
  console.log({
    caller,
    recipient,
    channelID,
    callType,
    callID,
  });
    notificationManager.sendCallNotification(
      caller,
      recipient,
      channelID,
      callType,
      callID,
    );
  });
};

export default sendCallInitiationRemoteNotification;
