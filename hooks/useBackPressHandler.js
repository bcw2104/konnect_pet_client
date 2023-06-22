import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';

export const useBackPressHandler = () => {
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backPressed);

    return ()=>{
      BackHandler.removeEventListener("hardwareBackPress", backPressed);
    }
  }, []);
  
  const backPressed = () => {
    Alert.alert('', 'Are you sure you want to close the app?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'OK', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };
};
