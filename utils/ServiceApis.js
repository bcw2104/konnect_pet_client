import { baseAxios } from "./Axios";

export default serviceApis = {
  //screen
  screenSignUpStep1: () => baseAxios.get(`/api/auth/v1/screen/signup/step1`),


  //auth
  login: (email,password) => baseAxios.post(`/api/auth/v1/login`, {email,password}),
  tokenRefresh: (accessToken,refreshToken) => baseAxios.post(`/api/auth/v1/token/refresh`, {},{
    headers: {
      Expired: `Bearer ${accessToken}`,
      Refresh: `Bearer ${refreshToken}`,
    },
  }),

  //verification
  requestSmsVerification: (tel) => baseAxios.post(`/api/auth/v1/verify/sms`, {tel}),
  submitSmsVerification: (reqId,timestamp,verify) => baseAxios.post(`/api/auth/v1/verify/sms/check`, {reqId,timestamp,verify}),
}