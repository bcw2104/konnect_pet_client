import { baseAxios } from "./Axios";

export default serviceApis = {
  //screen
  screenSignupStep1: () => baseAxios.get(`/api/auth/v1/screen/signup/step1`),
  screenSignupStep3: () => baseAxios.get(`/api/auth/v1/screen/signup/step3`),


  //auth
  login: (email,password) => baseAxios.post(`/api/auth/v1/login`, {email,password}),
  socialLogin: (token,type) => baseAxios.post(`/api/auth/v1/login/social`, {
    token:token,
    type:type
  }),
  join: (payload) => baseAxios.post(`/api/auth/v1/join`, payload),

  tokenRefresh: (accessToken,refreshToken) => baseAxios.post(`/api/auth/v1/token/refresh`, {},{
    headers: {
      EXPRIED: `Bearer ${accessToken}`,
      REFRESH: `Bearer ${refreshToken}`,
    },
  }),

  //terms
  requestSignupTerms: (groupId) => baseAxios.get(`/api/auth/v1/terms/group/${groupId}/lastest`),

  //verification
  requestSmsVerification: (tel) => baseAxios.post(`/api/auth/v1/verify/sms`, {tel}),
  submitSmsVerification: (reqId,timestamp,encTel,verify) => baseAxios.post(`/api/auth/v1/verify/sms/check`, {reqId,timestamp,encTel,verify}),
  requestEmailVerification: (email) => baseAxios.post(`/api/auth/v1/verify/email`, {email}),
  submitEmailVerification: (reqId,timestamp,email,verify) => baseAxios.post(`/api/auth/v1/verify/email/check`, {reqId,timestamp,email,verify}),

  //user
  getUserInfo: () =>  baseAxios.get(`/api/user/v1/info`),


}