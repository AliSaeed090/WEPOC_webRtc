import { IMLocalized, setI18nConfig } from './Core/localization/IMLocalization';
import DynamicAppStyles from './DynamicAppStyles';

setI18nConfig();

const regexForNames = /^[a-zA-Z]{2,25}$/;
const regexForPhoneNumber = /\d{9}$/;

const ChatConfig = {
  isSMSAuthEnabled: true,
  appIdentifier: 'rn-messenger-android',
  onboardingConfig: {
    welcomeTitle: 'WELCOME TO WEPOC', //IMLocalized('Instachatty'),
    welcomeCaption: IMLocalized(
      'Send texts, photos, videos, and audio messages to your close friends.',
    ),
    walkthroughScreens: [
      {
        background: require('../assets/wepoc/onboarding1.jpg'),
        icon: require('../assets/wepoc/oval1.png'),
        title: "", //IMLocalized('Private Messages'),
        description: "RECORD, CREATE,\nANYWHERE, ANYTIME "
        // description: IMLocalized(
        //   'Communicate with your friends via private messages.',
        // ),
      },
      // {
      //   background: require('../assets/wepoc/onboarding2.jpg'),
      //   icon: require('../assets/wepoc/oval2.png'),
      //   title: "", //IMLocalized('Group Chats'),
      //   description: "CAPTURE YOUR IDEAS,\nAND SHARE WITH THE WORLD"
      //   // description: IMLocalized(
      //   //   'Create group chats and stay in touch with your gang.',
      //   // ),
      // },
      {
        background: require('../assets/wepoc/onboarding2.jpg'),
        icon: require('../assets/wepoc/oval3.png'),
        title: "", //IMLocalized('Send Photos & Videos'),
        description: "GET FEEDBACK\n& RECORD TOGETHER"
        // description: IMLocalized(
        //   'Have fun with your friends by sending photos and videos to each other.',
        // ),
      },
      // {
      //   background: require('../assets/wepoc/onboarding2.jpg'),
      //   icon: require('../assets/wepoc/oval4.png'),
      //   title: "", //IMLocalized('Get Notified'),
      //   description: "COLLABORATE\n& SHARE TOGETHER"
      //   // description: IMLocalized(
      //   //   'Receive notifications when your friends are looking for you.',
      //   // ),
      // },
    ],
  },
  drawerMenu: {
    upperMenu: [
      {
        title: IMLocalized('Home'),
        icon:
          Platform.OS === 'ios'
            ? DynamicAppStyles.iconSet.home
            : DynamicAppStyles.iconSet.home_android,
        navigationPath: 'HomeSearchStack',
      },
      {
        title: IMLocalized('Friends'),
        icon:
          Platform.OS === 'ios'
            ? DynamicAppStyles.iconSet.users
            : DynamicAppStyles.iconSet.users_android,
        navigationPath: 'FriendsSearchStack',
      },
      {
        title: IMLocalized('Profile'),
        icon:
          Platform.OS === 'ios'
            ? DynamicAppStyles.iconSet.user
            : DynamicAppStyles.iconSet.user_android,
        navigationPath: 'MyProfileStack',
      },
      {
        title: 'WEPOC Celebs',
        icon:
          Platform.OS === 'ios'
            ? DynamicAppStyles.iconSet.memo
            : DynamicAppStyles.iconSet.memo,
        navigationPath: 'ComingSoonStack',
      },
      {
        title: 'Logout',
        icon:
          Platform.OS === 'ios'
            ? DynamicAppStyles.iconSet.logout
            : DynamicAppStyles.iconSet.logout,
        navigationPath: 'LogoutStack',
      },
    ],
    lowerMenu: [],
  },
  tosLink: "https://wepocapp.com/terms-and-conditions/",  // TERMS & CONDITIONS
  editProfileFields: {
    sections: [
      {
        title: IMLocalized('PUBLIC PROFILE'),
        fields: [
          {
            displayName: IMLocalized('First Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'firstName',
            placeholder: 'Your first name',
          },
          {
            displayName: IMLocalized('Last Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'lastName',
            placeholder: 'Your last name',
          },
        ],
      },
      {
        title: IMLocalized('PRIVATE DETAILS'),
        fields: [
          {
            displayName: IMLocalized('E-mail Address'),
            type: 'text',
            editable: true,
            key: 'email',
            placeholder: 'Your email address',
          },
          {
            displayName: IMLocalized('Phone Number'),
            type: 'text',
            editable: true,
            regex: regexForPhoneNumber,
            key: 'phone',
            placeholder: 'Your phone number',
          },
        ],
      },
    ],
  },
  userSettingsFields: {
    sections: [
      {
        title: IMLocalized('GENERAL'),
        fields: [
          {
            displayName: IMLocalized('Allow Push Notifications'),
            type: 'switch',
            editable: true,
            key: 'push_notifications_enabled',
            value: true,
          },
          {
            ...(Platform.OS === 'ios'
              ? {
                  displayName: IMLocalized('Enable Face ID / Touch ID'),
                  type: 'switch',
                  editable: true,
                  key: 'face_id_enabled',
                  value: false,
                }
              : {}),
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Save'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  contactUsFields: {
    sections: [
      {
        title: IMLocalized('CONTACT'),
        fields: [
          {
            displayName: IMLocalized('Address'),
            type: 'text',
            editable: false,
            key: 'push_notifications_enabled',
            value: '142 Steiner Street, San Francisco, CA, 94115',
          },
          {
            displayName: IMLocalized('E-mail us'),
            value: 'contact@wepoc.com',
            type: 'text',
            editable: false,
            key: 'email',
            placeholder: 'Your e-mail address',
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Call Us'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  contactUsPhoneNumber: '+00000000000',
  facebookIdentifier: '104910621442797',
};

export default ChatConfig;
