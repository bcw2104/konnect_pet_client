import axios from 'axios';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { useStores } from '../../contexts/StoreContext';

const GoogleLogin = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: Constants.expoConfig.extra.GOOGLE_AUTH_CLIDENT_ID_WEB,
    androidClientId: Constants.expoConfig.extra.GOOGLE_AUTH_CLIDENT_ID_AOS,
    iosClientId: Constants.expoConfig.extra.GOOGLE_AUTH_CLIDENT_ID_IOS,
    responseType: ResponseType.Code,
    scopes: ['profile', 'email', 'openid'],
  });

  const { userStore } = useStores();

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.authentication.accessToken;
      getUserInfo(token);
    }
  }, [response]);

  const getUserInfo = async (token) => {
    try {
      const response = await axios.get(
        'http://10.0.2.2:8080/api/auth/v1/google/userinfo',
        {
          headers: { SOCIAL_AUTH_TOKEN: token },
        }
      );

      if (response.data.rsp_code == 1000) {
        const userInfo = response.data.result;
        userStore.initUserInfo({
          email: userInfo.email,
          platform: userInfo.platform,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Pressable
      title='Sign in with Google'
      disabled={!request}
      onPress={() => {
        promptAsync();
      }}
      style={styles.button}
    />
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
    marginHorizontal:10
  },
});

export default GoogleLogin;
