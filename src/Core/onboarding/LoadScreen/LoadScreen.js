import React, { useEffect, useRef } from 'react';
import { View, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import deviceStorage from '../utils/AuthDeviceStorage';

const LoadScreen = (props) => {
  const { navigation, route } = props;

  const appStyles = route.params.appStyles;
  const appConfig = route.params.appConfig;
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) => {
      setAppState();
    }),
  );

  useEffect(() => {
    setAppState();
    return () => {
      didFocusSubscription.current && didFocusSubscription.current();
    };
  }, []);

  const setAppState = async () => {
    var shouldShowOnboardingFlow = await deviceStorage.getShouldShowOnboardingFlow();
    // shouldShowOnboardingFlow = true;
    if (!shouldShowOnboardingFlow) {
      if (appConfig.isDelayedLoginEnabled) {
        navigation.navigate('DelayedHome');  
        return;
      }
      navigation.navigate('LoginStack', {
        appStyles: appStyles,
        appConfig: appConfig,
      });
    } else {
      navigation.navigate('Walkthrough', {
        appStyles: appStyles,
        appConfig: appConfig,
      });
    }
  };

  return (
    <ImageBackground
  
          source={
            require('../../../CoreAssets/APP/splash.png')
          }
          style={{width: '100%', height: '100%'}}>
      <View />
    </ImageBackground>
  );
};

LoadScreen.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.object,
};

LoadScreen.navigationOptions = {
  header: null,
};

export default LoadScreen;
