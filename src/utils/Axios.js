import axios from 'axios';
import { asyncStorage } from '../storage/Storage';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import * as Update from 'expo-updates';
import { Platform } from 'react-native';

const BASE_API_URL = process.env.NODE_ENV == 'development' ? (Platform.OS == 'ios' ? 'http://127.0.0.1:8080' : 'http://10.0.2.2:8080') : process.env.EXPO_PUBLIC_BASE_API_URL;

export const baseAxios = axios.create({
  baseURL: BASE_API_URL,
});

baseAxios.interceptors.request.use(async function (config) {
  const accessToken = await asyncStorage.getItem('access_token');
  config.timeout = 30000;
  if (!!accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return config;
});

baseAxios.interceptors.response.use(
  function (response) {
    return response?.data;
  },

  async function (error) {
    const { config: originConfig, response } = error;
    // 토큰 갱신 로직

    if (response?.data?.rsp_code === '9202') {
      if (originConfig?.attempt >= 3) {
        return Promise.reject(error);
      }
      const refreshToken = await asyncStorage.getItem('refresh_token');

      const config = {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      };

      try {
        const result = await axios.post(`${BASE_API_URL}/api/v1/auth/token/refresh`, {}, config);

        if (result?.data?.rsp_code == '1000') {
          asyncStorage.setItem('access_token', result.data.result.accessToken);
          asyncStorage.setItem('access_token_expire_at', result.data.result.accessTokenExpireAt);
          asyncStorage.setItem('refresh_token', result.data.result.refreshToken);
          asyncStorage.setItem('refresh_token_expire_at', result.data.result.refreshTokenExpireAt);

          originConfig.headers.Authorization = `Bearer ${result.data.result.accessToken}`;
          originConfig.attempt = !originConfig.attempt ? 1 : originConfig.attempt++;

          const rerespone = await axios.request(originConfig);
          return rerespone?.data;
        }
      } catch (e) {
        await asyncStorage.resetToken();
        Update.reloadAsync();
        return Promise.reject(error);
      }
    } else {
      if (response?.data?.rsp_code == '9201') {
        await asyncStorage.resetToken();
        Update.reloadAsync();
      }
      Toast.show({
        type: 'error',
        text1: response.data?.rsp_msg_detail || 'Please try again later',
      });
      return Promise.reject(error);
    }
  }
);
