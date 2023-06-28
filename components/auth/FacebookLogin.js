import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import serviceApis from '../../utils/ServiceApis';
import { platform } from '../../commons/constants';
import { asyncStorage } from '../../storage/Storage';
import { useStores } from '../../contexts/StoreContext';
import { Navigator } from '../../navigations/Navigator';
import { AccessToken, AuthenticationToken, LoginManager, Settings } from 'react-native-fbsdk-next';
import { Platform } from 'react-native';

const FacebookLogin = () => {
  const { userStore } = useStores();

  const signIn = async () => {
    const {isCancelled} = await LoginManager.logInWithPermissions(['email','public_profile']);
    
    if(isCancelled) return;

    let token;
    if (Platform.OS === 'ios') {
      token = await AuthenticationToken.getAuthenticationTokenIOS();
    } else {
      token = await AccessToken.getCurrentAccessToken();
    }

    try {
      const response = await serviceApis.socialLogin(
        token,
        platform.FACEBOOK
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
          platform: platform.FACEBOOK,
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
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default FacebookLogin;
