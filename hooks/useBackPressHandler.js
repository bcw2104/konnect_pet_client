import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { Navigator, navigationRef } from '../navigations/Navigator';

export const useBackPressHandler = () => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backPressed);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backPressed);
    };
  }, []);

  const backPressed = () => {
    if (!navigationRef.getState() || navigationRef.getState().index == 0) {
      Alert.alert('', 'Are you sure you want to close the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'OK', onPress: () => BackHandler.exitApp() },
      ]);
    } else {
      Navigator.goBack();
    }
    return true;
  };
};
