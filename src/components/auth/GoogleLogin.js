import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { serviceApis } from '../../utils/ServiceApis';
import { FONT_WEIGHT, SOCIAL_TYPE } from '../../commons/constants';
import { asyncStorage } from '../../storage/Storage';
import { useStores } from '../../contexts/StoreContext';
import { Navigator } from '../../navigations/Navigator';
import { Image } from 'react-native';
import { COLORS } from './../../commons/colors';
import CustomText from '../elements/CustomText';

const GoogleLogin = () => {
  const { userStore, systemStore } = useStores();

  GoogleSignin.configure({});

  const signIn = async () => {
    systemStore.setIsLoading(true);
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
      systemStore.setIsLoading(false);
      return;
    }
    try {
      const response = await serviceApis.socialLogin(
        tokens.accessToken,
        SOCIAL_TYPE.GOOGLE
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
      } else if (response.rsp_code === '9216') {
        Navigator.navigate(
          {
            platform: SOCIAL_TYPE.GOOGLE,
            emailVerifyKey: response.result.key,
          },
          'signup_step1'
        );
      }
    } catch (error) {
    } finally {
      systemStore.setIsLoading(false);
    }
  };

  return (
    <>
      <Pressable
        title="Sign in with Google"
        onPress={signIn}
        style={styles.button}
      >
        <Image
          style={styles.logo}
          source={require('../../../assets/images/logos/logo_google.png')}
        />
        <CustomText
          fontColor={COLORS.dark}
          fontSize={16}
          fontWeight={FONT_WEIGHT.BOLD}
        >
          Continue With Google
        </CustomText>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    marginBottom: 15,
    height: 60,
    paddingLeft: 100,
  },
  logo: {
    borderRadius: 25,
    width: 50,
    height: 50,
    position: 'absolute',
    left: 30,
  },
});

export default GoogleLogin;
