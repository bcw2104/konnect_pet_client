import { asyncStorage } from '../storage/Storage';
import serviceApis from './ServiceApis';

export const utils = {
  async checkLogin() {
    const accessToken = await asyncStorage.getItem('access_token');
    const accessTokenExpireAt = await asyncStorage.getItem(
      'access_token_expire_at'
    );
    const refreshToken = await asyncStorage.getItem('refresh_token');
    const refreshTokenExpireAt = await asyncStorage.getItem(
      'refresh_token_expire_at'
    );

    //강제 로그인
    if (
      !refreshToken ||
      !refreshTokenExpireAt ||
      Date.now() + 1000 * 60 * 60 * 24 > refreshTokenExpireAt
    ) {
      await asyncStorage.resetToken();
      return false;
    } else if (!accessToken || !accessTokenExpireAt || Date.now() + 1000 * 60 * 10 > accessTokenExpireAt) {
      const result = await serviceApis.tokenRefresh(accessToken, refreshToken);

      if (result.data.rsp_code == '1000') {
        asyncStorage.setItem('access_token', result.data.accessToken);
        asyncStorage.setItem('access_token_expire_at', result.data.accessTokenExpireAt);
        asyncStorage.setItem('refresh_token', result.data.refreshToken);
        asyncStorage.setItem('refresh_token_expire_at', result.data.refreshTokenExpireAt);

        return true;
      }
      else{
        return false;
      }
    }else{
      return true;
    }
  },
};
