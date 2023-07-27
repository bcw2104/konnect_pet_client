import { baseAxios } from "./Axios";

export default serviceApis = {
  //screen
  screenNations: () => baseAxios.get(`/api/screen/public/v1/nations`),

  //auth
  login: (email,password) => baseAxios.post(`/api/auth/v1/login`, {email,password}),
  socialLogin: (token,type) => baseAxios.post(`/api/auth/v1/login/social`, {
    token:token,
    type:type
  }),
  join: (payload) => baseAxios.post(`/api/auth/v1/join`, payload),
  resetPassword: (payload) => baseAxios.post(`/api/auth/v1/password/reset`, payload),


  tokenRefresh: () => baseAxios.post(`/api/auth/v1/token/refresh`),

  //mypage
  leaveUser: (smsVerifyKey) => baseAxios.post(`/api/user/v1/mypage/leave`, {smsVerifyKey}),

  //terms
  getTermsDetail: (groupId) => baseAxios.get(`/api/terms/v1/group/${groupId}/lastest`),
  getSignUpTerms: () => baseAxios.get(`/api/terms/v1/group/signup`),
  getAllTerms: () => baseAxios.get(`/api/terms/v1/group/all`),

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
  logout: () =>  baseAxios.post(`/api/user/v1/logout`),
  getUserInfo: () =>  baseAxios.get(`/api/user/v1/info`),
  updateDeviceInfo: (deviceModel, deviceOs, deviceOsVersion, deviceToken) => baseAxios.post(`/api/user/v1/device`,{deviceModel, deviceOs, deviceOsVersion, deviceToken}),

  //walking
  startWalking: () => baseAxios.post(`/api/walking/v1/start`),
  saveWalking: (payload) => baseAxios.post(`/api/walking/v1/save`,payload),
  getWalkingReport: (walkingId) => baseAxios.get(`/api/walking/v1/report/${walkingId}`),
  getAroundFootprints: (lat,lng) => baseAxios.get(`/api/walking/v1/footprints/around`,{
    params: {lat,lng}
  }),

  uploadFiles: (payload) => baseAxios.post(`/api/upload/v1/images/profile/pet`,payload,{
    headers: {
      "Content-Type": `multipart/form-data`,
    },
  }),

  //pet
  savePet : (payload) => baseAxios.put(`/api/user/v1/pet`,payload)
}