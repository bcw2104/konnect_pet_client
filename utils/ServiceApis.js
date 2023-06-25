import { baseAxios } from "./Axios";

export default serviceApis = {
  //screen
  screenSignupStep1: () => baseAxios.get(`/api/auth/v1/screen/signup/step1`),
  screenSignupStep3: () => baseAxios.get(`/api/auth/v1/screen/signup/step3`),


  //auth
  login: (email,password) => baseAxios.post(`/api/auth/v1/login`, {email,password}),
  join: (payload) => baseAxios.post(`/api/auth/v1/join`, payload),
  tokenRefresh: (accessToken,refreshToken) => baseAxios.post(`/api/auth/v1/token/refresh`, {},{
    headers: {
      Expired: `Bearer ${accessToken}`,
      Refresh: `Bearer ${refreshToken}`,
    },
  }),

  //terms
  requestSignupTerms: (groupId) => baseAxios.get(`/api/auth/v1/terms/group/${groupId}/lastest`),

  //verification
  requestSmsVerification: (tel) => baseAxios.post(`/api/auth/v1/verify/sms`, {tel}),
  submitSmsVerification: (reqId,timestamp,verify) => baseAxios.post(`/api/auth/v1/verify/sms/check`, {reqId,timestamp,verify}),
  requestEmailVerification: (email) => baseAxios.post(`/api/auth/v1/verify/email`, {email}),
  submitEmailVerification: (reqId,timestamp,verify) => baseAxios.post(`/api/auth/v1/verify/email/check`, {reqId,timestamp,verify}),

  //user
  getUserInfo: () =>  baseAxios.get(`/api/user/v1/info`),


}