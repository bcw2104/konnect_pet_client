import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import serviceApis from '../../utils/ServiceApis';
import { platform } from '../../commons/constants';
import { asyncStorage } from '../../storage/Storage';
import { useStores } from '../../contexts/StoreContext';
import { Navigator } from '../../navigations/Navigator';

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
      console.log(error)
      Toast.show({
        type: 'error',
        text1: 'Please try again later',
      });
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
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default GoogleLogin;
