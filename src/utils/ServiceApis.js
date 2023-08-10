import { baseAxios } from './Axios';

export const serviceApis = {
  //common
  telNations: () => baseAxios.get(`/api/v1/common/public/nations`),

  //auth
  login: (email, password) => baseAxios.post(`/api/v1/auth/login`, { email, password }),
  socialLogin: (token, type) =>
    baseAxios.post(`/api/v1/auth/login/social`, {
      token: token,
      type: type,
    }),
  join: (payload) => baseAxios.post(`/api/v1/auth/join`, payload),
  resetPassword: (payload) => baseAxios.post(`/api/v1/auth/password/reset`, payload),

  tokenRefresh: () => baseAxios.post(`/api/v1/auth/token/refresh`),

  //mypage
  getMyData: () => baseAxios.get(`/api/v1/user/mypage`),
  leaveUser: (smsVerifyKey) => baseAxios.post(`/api/v1/user/mypage/leave`, { smsVerifyKey }),
  getNotifications: () => baseAxios.get(`/api/v1/user/noti`),
  getPointHistories : (pointType,type,size,page,) => baseAxios.get(`/api/v1/user/point/history`, { params:{ point:pointType,type: type, size:size, page:page  } }),
  getNotifications : (size,page) => baseAxios.get(`/api/v1/user/noti`,{ params:{ size:size, page:page }}),


  //terms
  getTermsDetail: (groupId) => baseAxios.get(`/api/v1/terms/group/${groupId}/lastest`),
  getSignUpTerms: () => baseAxios.get(`/api/v1/terms/group/signup`),
  getAllTerms: () => baseAxios.get(`/api/v1/terms/group/all`),

  //verification
  requestJoinSmsVerification: (tel) => baseAxios.post(`/api/v1/auth/join/verify/sms`, { tel }),
  submitJoinSmsVerification: (reqId, timestamp, tel, verify) =>
    baseAxios.post(`/api/v1/auth/join/verify/sms/check`, {
      reqId,
      timestamp,
      tel,
      verify,
    }),
  requestJoinEmailVerification: (email) => baseAxios.post(`/api/v1/auth/join/verify/email`, { email }),
  submitJoinEmailVerification: (reqId, timestamp, email, verify) =>
    baseAxios.post(`/api/v1/auth/join/verify/email/check`, {
      reqId,
      timestamp,
      email,
      verify,
    }),

  requestResetPasswordEmailVerification: (email) => baseAxios.post(`/api/v1/auth/password/reset/verify/email`, { email }),
  submitResetPasswordEmailVerification: (reqId, timestamp, email, verify) =>
    baseAxios.post(`/api/v1/auth/password/reset/verify/email/check`, {
      reqId,
      timestamp,
      email,
      verify,
    }),

  requestSmsVerification: () => baseAxios.post(`/api/v1/user/verify/sms`),
  submitSmsVerification: (reqId, timestamp, tel, verify) =>
    baseAxios.post(`/api/v1/user/verify/sms/check`, {
      reqId,
      timestamp,
      tel,
      verify,
    }),
  requestEmailVerification: () => baseAxios.post(`/api/v1/user/verify/email`),
  submitEmailVerification: (reqId, timestamp, email, verify) =>
    baseAxios.post(`/api/v1/user/verify/email/check`, {
      reqId,
      timestamp,
      email,
      verify,
    }),

  //user
  logout: () => baseAxios.post(`/api/v1/user/logout`),
  getUserInfo: () => baseAxios.get(`/api/v1/user/info`),
  updateDeviceInfo: (deviceModel, deviceOs, deviceOsVersion, deviceToken) =>
    baseAxios.post(`/api/v1/user/device`, {
      deviceModel,
      deviceOs,
      deviceOsVersion,
      deviceToken,
    }),
  saveProfile: (payload) => baseAxios.post(`/api/v1/user/profile`, payload),

  //walking
  startWalking: () => baseAxios.post(`/api/v1/walking/start`),
  saveWalking: (payload) => baseAxios.post(`/api/v1/walking/save`, payload),
  getWalkingReport: (walkingId) => baseAxios.get(`/api/v1/walking/report/${walkingId}`),
  getAroundFootprints: (lat, lng) =>
    baseAxios.get(`/api/v1/walking/footprints/around`, {
      params: { lat, lng },
    }),
  getFootprintDetail: (footprintId) =>
    baseAxios.get(`/api/v1/walking/footprints/${footprintId}`),

  //pet
  savePet: (payload) => baseAxios.put(`/api/v1/user/pet`, payload),
  editPet: (id, payload) => baseAxios.patch(`/api/v1/user/pet/${id}`, payload),

  //community
  requestFriend:(toUserId) => baseAxios.put(`/api/v1/community/friend/${toUserId}`),
};
