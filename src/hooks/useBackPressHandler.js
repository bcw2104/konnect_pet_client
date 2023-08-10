import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { Navigator, navigationRef } from '../navigations/Navigator';
import { useCallback } from 'react';
import { useStores } from '../contexts/StoreContext';

export const useBackPressHandler = () => {
  const { systemStore, modalStore } = useStores();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backPressed);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backPressed);
    };
  }, []);

  const backPressed = useCallback(() => {
    if (!!systemStore.backHandlerCallback) {
      systemStore.backHandlerCallback();
    } else if (
      !navigationRef.getState() ||
      navigationRef.getState().index == 0
    ) {
      modalStore.openTwoButtonModal(
        'Are you sure you want to close the app?',
        'Cancel',
        null,
        'OK',
        () => {
          BackHandler.exitApp();
        }
      );
    } else {
      Navigator.goBack();
    }
    return true;
  }, [systemStore.backHandlerCallback]);
};
