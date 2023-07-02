import React from 'react';
import { Image, Pressable, StyleSheet} from 'react-native';
import serviceApis from '../../utils/ServiceApis';
import { platform } from '../../commons/constants';
import { asyncStorage } from '../../storage/Storage';
import { useStores } from '../../contexts/StoreContext';
import { Navigator } from '../../navigations/Navigator';
import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
} from 'react-native-fbsdk-next';
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
      const response = await serviceApis.socialLogin(token.accessToken, platform.FACEBOOK);

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
      } else if (response.rsp_code === '9215') {
        Navigator.navigate('signup_step1', {
          platform: platform.FACEBOOK,
          emailVerifyKey: response.result.key,
        });
      }
    } catch (error) {}
  };

  return (
    <Pressable
      title='Sign in with Google'
      onPress={signIn}
      style={styles.button}
    >
      <Image
        style={styles.logo}
        source={require('../../assets/images/logos/logo_facebook.png')}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  logo:{
    width: 60,
    height: 60,
    borderRadius: 30,
  }
});

export default FacebookLogin;
