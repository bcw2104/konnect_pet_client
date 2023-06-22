import axios from 'axios';
import Constants from 'expo-constants';
import { asyncStorage } from '../storage/Storage';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import * as Update from 'expo-updates';

export const baseAxios = axios.create({
  baseURL: Constants.expoConfig.extra.BASE_API_URL,
});

baseAxios.interceptors.response.use(
  function (response) {
    if (response.data.rsp_code !== '1000') {
      Toast.show({
        type: 'error',
        text1: response.data.rsp_msg,
      });
    }
    return response.data;
  },

  async function (error) {
    const { config: originConfig, response } = error;
    // 토큰 갱신 로직
    if (response.data.rsp_code === '9202') {
      const accessToken = await asyncStorage.getItem('access_token');
      const refreshToken = await asyncStorage.getItem('refresh_token');

      const config = {
        headers: {
          Expired: `Bearer ${accessToken}`,
          Refresh: `Bearer ${refreshToken}`,
        },
      };

      try {
        const result = await axios.post(
          `${Constants.expoConfig.extra.BASE_API_URL}/api/auth/v1/token/refresh`,
          {},
          config
        );

        if (result.data.rsp_code == '1000') {
          asyncStorage.setItem('access_token', result.data.accessToken);
          asyncStorage.setItem(
            'access_token_expire_at',
            result.data.accessTokenExpireAt
          );
          asyncStorage.setItem('refresh_token', result.data.refreshToken);
          asyncStorage.setItem(
            'refresh_token_expire_at',
            result.data.refreshTokenExpireAt
          );

          axios(originConfig);
        }
      } catch (e) {
        await asyncStorage.resetToken();
        Update.reloadAsync();
      }
    } else {
      Toast.show({
        type: 'error',
        text1: response.data?.rsp_msg || 'Please try again later',
      });
    }
    return response.data;
  }
);
