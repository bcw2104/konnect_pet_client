import { baseAxios } from "./Axios";

export default serviceApis = {

  login: (payload) => baseAxios.post(`/api/auth/v1/login`, payload),
  tokenRefresh: (accessToken,refreshToken) => baseAxios.post(`/api/auth/v1/token/refresh`, {},{
    headers: {
      Expired: `Bearer ${accessToken}`,
      Refresh: `Bearer ${refreshToken}`,
    },
  }),
}