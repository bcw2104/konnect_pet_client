import { baseAxios } from "./Axios";

export default serviceApis = {
  //screen
  screenSignupStep1: () => baseAxios.get(`/api/auth/v1/screen/signup/step1`),
  screenSignupStep3: () => baseAxios.get(`/api/auth/v1/screen/signup/step3`),
  
  screenLeave: () => baseAxios.get(`/api/user/v1/screen/mypage/leave`),


  //auth
  login: (email,password) => baseAxios.post(`/api/auth/v1/login`, {email,password}),
  socialLogin: (token,type) => baseAxios.post(`/api/auth/v1/login/social`, {
    token:token,
    type:type
  }),
  join: (payload) => baseAxios.post(`/api/auth/v1/join`, payload),
  resetPassword: (payload) => baseAxios.post(`/api/auth/v1/password/reset`, payload),


  tokenRefresh: (accessToken,refreshToken) => baseAxios.post(`/api/auth/v1/token/refresh`, {},{
    headers: {
      EXPRIED: `Bearer ${accessToken}`,
      REFRESH: `Bearer ${refreshToken}`,
    },
  }),

  //terms
  requestSignupTerms: (groupId) => baseAxios.get(`/api/auth/v1/terms/group/${groupId}/lastest`),

  //verification
  requestJoinSmsVerification: (tel) => baseAxios.post(`/api/auth/v1/join/verify/sms`, {tel}),
  submitJoinSmsVerification: (reqId,timestamp,tel,verify) => baseAxios.post(`/api/auth/v1/join/verify/sms/check`, {reqId,timestamp,tel,verify}),
  requestJoinEmailVerification: (email) => baseAxios.post(`/api/auth/v1/join/verify/email`, {email}),
  submitJoinEmailVerification: (reqId,timestamp,email,verify) => baseAxios.post(`/api/auth/v1/join/verify/email/check`, {reqId,timestamp,email,verify}),
  
  requestResetPasswordEmailVerification: (email) => baseAxios.post(`/api/auth/v1/password/reset/verify/email`, {email}),
  submitResetPasswordEmailVerification: (reqId,timestamp,email,verify) => baseAxios.post(`/api/auth/v1/password/reset/verify/email/check`, {reqId,timestamp,email,verify}),
  
  requestSmsVerification: () => baseAxios.post(`/api/user/v1/verify/sms`),
  submitSmsVerification: (reqId,timestamp,tel,verify) => baseAxios.post(`/api/user/v1/verify/sms/check`, {reqId,timestamp,tel,verify}),
  requestEmailVerification: () => baseAxios.post(`/api/user/v1/verify/email`),
  submitEmailVerification: (reqId,timestamp,email,verify) => baseAxios.post(`/api/user/v1/verify/email/check`, {reqId,timestamp,email,verify}),

  //user
  getUserInfo: () =>  baseAxios.get(`/api/user/v1/info`),
  updateDeviceInfo: (deviceModel, deviceOs, deviceOsVersion, deviceToken) => baseAxios.post(`/api/user/v1/device`,{deviceModel, deviceOs, deviceOsVersion, deviceToken})
}