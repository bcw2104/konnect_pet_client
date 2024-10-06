import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { serviceApis } from '../../utils/ServiceApis';
import { FONT_WEIGHT, SOCIAL_TYPE } from '../../commons/constants';
import { asyncStorage } from '../../storage/Storage';
import { useStores } from '../../contexts/StoreContext';
import { Navigator } from '../../navigations/Navigator';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { COLORS } from '../../commons/colors';
import CustomText from '../elements/CustomText';

const FacebookLogin = () => {
  const { userStore, systemStore } = useStores();

  const signIn = async () => {
    systemStore.setIsLoading(true);
    try {
      const { isCancelled } = await LoginManager.logInWithPermissions([
        'email',
        'public_profile',
      ]);

      if (isCancelled) {
        systemStore.setIsLoading(false);
        return;
      }

      const token = await AccessToken.getCurrentAccessToken();

      const response = await serviceApis.socialLogin(
        token.accessToken,
        SOCIAL_TYPE.FACEBOOK
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
            platform: SOCIAL_TYPE.FACEBOOK,
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
    <Pressable
      title="Sign in with Google"
      onPress={signIn}
      style={styles.button}
    >
      <Image
        style={styles.logo}
        source={require('../../../assets/images/logos/logo_facebook.png')}
      />
      <CustomText
        fontColor={COLORS.dark}
        fontSize={16}
        fontWeight={FONT_WEIGHT.BOLD}
      >
        Continue With FaceBook
      </CustomText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    marginBottom: 20,
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

export default FacebookLogin;
