import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import serviceApis from '../../utils/ServiceApis';
import { platform } from '../../commons/constants';
import { asyncStorage } from '../../storage/Storage';
import { useStores } from '../../contexts/StoreContext';
import { Navigator } from '../../navigations/Navigator';
import { Image } from 'react-native';
import colors from './../../commons/colors';

const GoogleLogin = () => {
  const { userStore } = useStores();

  GoogleSignin.configure({});

  const signIn = async () => {
    let tokens;
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      tokens = await GoogleSignin.getTokens();
    } catch (error) {
      if (
        error.code != statusCodes.SIGN_IN_CANCELLED &&
        error.code != statusCodes.IN_PROGRESS
      ) {
        Toast.show({
          type: 'error',
          text1: 'Please try again later',
        });
      }
      return;
    }
    try {
      const response = await serviceApis.socialLogin(
        tokens.accessToken,
        platform.GOOGLE
      );

      if (response.rsp_code === '1000') {
        asyncStorage.setItem('access_token', response.result.accessToken);
        asyncStorage.setItem(
          'access_token_expire_at',
          response.result.accessTokenExpireAt
        );
        asyncStorage.setItem('refresh_token', response.result.refreshToken);
        asyncStorage.setItem(
          'refresh_token_expire_at',
          response.result.refreshTokenExpireAt
        );
        userStore.initUserInfo();
      } else if (response.rsp_code === '9210') {
        Navigator.navigate('signup_step1', {
          platform: platform.GOOGLE,
          email: response.result.email,
        });
      }
    } catch (error) {}
  };

  return (
    <>
      <Pressable
        title='Sign in with Google'
        onPress={signIn}
        style={styles.button}
      >
        <Image
          style={styles.logo}
          source={require('../../assets/images/logos/logo_google.png')}
        />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  logo:{
    borderRadius: 30,
    width: 60,
    height: 60,
  }
});

export default GoogleLogin;
