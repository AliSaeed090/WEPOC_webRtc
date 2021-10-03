import PropTypes from 'prop-types';
import React, {
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
  useRef,

} from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import { IMChatHomeComponent } from '../../Core/chat';
import { TNTouchableIcon } from '../../Core/truly-native';
import AppStyles from '../../DynamicAppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import FriendshipTracker from '../../Core/socialgraph/friendships/firebase/tracker';
import { View } from 'react-native';


const HomeScreen = (props) => {
  const { store } = useContext(ReactReduxContext);
  const { navigation } = props;

  let colorScheme = useColorScheme();
  let currentTheme = AppStyles.navThemeConstants[colorScheme];

  const [loading, setLoading] = useState(true);

  const friends = useSelector((state) => state.friends.friends);
  const currentUser = useSelector((state) => state.auth.user);
  const channels = useSelector((state) => state.chat.channels);
  const friendships = useSelector((state) => state.friends.friendships);

  const friendshipTracker = useRef(null);

  useLayoutEffect(() => {

    navigation.setOptions({
      headerTitle: IMLocalized('Home'),
      headerRight: () => (
        <View style={{flexDirection:'row'}}>
          <TNTouchableIcon
            imageStyle={{ tintColor: currentTheme.fontColor }}
            iconSource={AppStyles.iconSet.inscription}
            onPress={() =>
              navigation.navigate('CreateGroup', { appStyles: AppStyles, title: "Create" })
            }
            appStyles={AppStyles}
          />
          <TNTouchableIcon
            imageStyle={{ tintColor: currentTheme.fontColor }}
            iconSource={AppStyles.iconSet.contacts}
            onPress={() =>
              navigation.navigate('IMContactScreen', { appStyles: AppStyles, title: "Create" })
            }
            appStyles={AppStyles}
          />
      </View>
      ),
      headerLeft: () => (
        <TNTouchableIcon
          imageStyle={{ tintColor: currentTheme.fontColor }}
          iconSource={AppStyles.iconSet.menuHamburger}
          onPress={openDrawer}
          appStyles={AppStyles}
        />
      ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
  }, []);





  useEffect(() => {
    friendshipTracker.current = new FriendshipTracker(store, currentUser?.id);
    friendshipTracker.current.subscribeIfNeeded();
  }, [currentUser?.id]);

  const openDrawer = () => {
    props.navigation.openDrawer();
  };

  const onFriendItemPress = (friend) => {
    // console.log({friend})
    const id1 = currentUser.id || currentUser.userID;
    const id2 =
      friend.id || friend.userID || friend.user.id || friend.user.userID;
    let channel = {
      id: id1 < id2 ? id1 + id2 : id2 + id1,
      participants: friend.user ? [friend.user] : [friend],
    };

    const otherChannelInfo = channels?.find(
      (currentChannel) => currentChannel.id === channel.id,
    );

    if (otherChannelInfo) {
      channel = {
        ...channel,
        ...otherChannelInfo,
      };
    }

    props.navigation.navigate('PersonalChat', {
      channel,
      appStyles: AppStyles,
    });
  };

  const onSearchButtonPress = async () => {
    props.navigation.navigate('IMContactScreen', {
      appStyles: AppStyles,
      followEnabled: false,
    });
  };

  const onEmptyStatePress = () => {
    onSearchButtonPress();
  };

  const onSenderProfilePicturePress = (item) => {
    // console.log(item);
  };

  return (
    <IMChatHomeComponent
      loading={loading}
      friends={friends}
      onFriendItemPress={onFriendItemPress}
      onSearchBarPress={onSearchButtonPress}
      appStyles={AppStyles}
      navigation={props.navigation}
      onEmptyStatePress={onEmptyStatePress}
      onSenderProfilePicturePress={onSenderProfilePicturePress}
      user={currentUser}
    />
  );
};

export default HomeScreen;
