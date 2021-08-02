import { setChannelsSubcribed, setChannels } from '../redux';
import { setUserData } from '../../onboarding/redux/auth';
import { setBannedUserIDs } from '../../user-reporting/redux';
import { firebaseUser } from './../../firebase';
import { reportingManager } from '../../user-reporting';
import { channelManager } from '../firebase';
import CryptoJS from "react-native-crypto-js";

export default class ChannelsTracker {
  constructor(reduxStore, userID) {
    this.reduxStore = reduxStore;
    this.userID = userID;
  }

  subscribeIfNeeded = () => {
    const userId = this.userID;
    const state = this.reduxStore.getState();
    if (!state.chat.areChannelsSubcribed) {
      this.reduxStore.dispatch(setChannelsSubcribed());
      this.currentUserUnsubscribe = firebaseUser.subscribeCurrentUser(
        userId,
        this.onCurrentUserUpdate,
      );
      this.abusesUnsubscribe = reportingManager.unsubscribeAbuseDB(
        userId,
        this.onAbusesUpdate,
      );
      this.channelsUnsubscribe = channelManager.subscribeChannels(
        userId,
        this.onChannelCollectionUpdate,
      );
    }
  };

  unsubscribe = () => {
    if (this.currentUserUnsubscribe) {
      this.currentUserUnsubscribe();
    }
    if (this.channelsUnsubscribe) {
      this.channelsUnsubscribe();
    }
    if (this.abusesUnsubscribe) {
      this.abusesUnsubscribe();
    }
  };

  onCurrentUserUpdate = (user) => {
    this.reduxStore.dispatch(setUserData({ user }));
  };

  onAbusesUpdate = (abuses) => {
    var bannedUserIDs = [];
    abuses.forEach((abuse) => bannedUserIDs.push(abuse.dest));
    this.reduxStore.dispatch(setBannedUserIDs(bannedUserIDs));
    this.bannedUserIDs = bannedUserIDs;
    this.updateChannelsIfNeeded();
  };

  onChannelCollectionUpdate = (channels) => {
    this.channels = channels;
    this.updateChannelsIfNeeded();
  };

  channelsWithNoBannedUsers = (channels, bannedUserIDs) => {
    const channelsWithNoBannedUsers = [];
    channels.forEach((channel) => {
      if (
        channel.participants &&
        channel.participants.length > 0 &&
        (!bannedUserIDs ||
          channel.participants.length != 1 ||
          !bannedUserIDs.includes(channel.participants[0].id))
      ) {
        channelsWithNoBannedUsers.push(channel);
      }
    });
    return channelsWithNoBannedUsers;
  };

  updateChannelsIfNeeded = () => {
    if (!this.channels || !this.bannedUserIDs) {
      return;
    }
    const channels = this.channelsWithNoBannedUsers(
      this.channels,
      this.bannedUserIDs,
    );
    console.log({ channels })
    var newchannels = channels.map((data) => {
      console.log({data})
      let bytes = CryptoJS.AES.decrypt(data.content, 'secretkey123');
      let decrypt = bytes.toString(CryptoJS.enc.Utf8);

      data["content"] = decrypt
      return data

    })
    this.reduxStore.dispatch(setChannels(newchannels));
  };
}
