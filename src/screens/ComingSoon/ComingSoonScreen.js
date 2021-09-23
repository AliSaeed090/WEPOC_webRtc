import React, { useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import AppStyles from '../../DynamicAppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { logout, setUserData } from '../../Core/onboarding/redux/auth';
import ChatConfig from '../../config';
import { View, ImageBackground, Image } from 'react-native';
import { TNTouchableIcon } from '../../Core/truly-native';
import { IMUserProfileComponent } from '../../Core/profile';
import authManager from '../../Core/onboarding/utils/authManager';
import { useColorScheme } from 'react-native-appearance';

const ComingSoonScreen = (props) => {
  const { navigation } = props;
  let colorScheme = useColorScheme();

  useLayoutEffect(() => {
    const currentTheme = AppStyles.navThemeConstants[colorScheme];
    navigation.setOptions({
      title: IMLocalized('WEPOC Studio'),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTitleStyle: {
        color: currentTheme.fontColor,
      },
      headerLeft: () => (
        <TNTouchableIcon
          imageStyle={{ tintColor: currentTheme.fontColor }}
          iconSource={AppStyles.iconSet.menuHamburger}
          onPress={navigation.openDrawer}
          appStyles={AppStyles}
        />
      ),
    });
  });


  return (
    // <IMUserProfileComponent
    //   user={props.user}
    //   onUpdateUser={onUpdateUser}
    //   onLogout={onLogout}
    //   menuItems={menuItems}
    //   appStyles={AppStyles}
    // />
    <View style={{backgroundColor:"black"}}>
      <Image
            source={
              require('../../../assets/wepoc/comingsoon.png')
            }
            style={{width: '100%', height: '100%',
            resizeMode: 'contain',}}>
      </Image>
    </View>
  );
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
});

export default connect(mapStateToProps, { logout, setUserData })(
  ComingSoonScreen,
);
