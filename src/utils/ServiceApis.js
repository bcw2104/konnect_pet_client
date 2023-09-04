import { baseAxios } from './Axios';

export const serviceApis = {
  //common
  telNations: () => baseAxios.get(`/api/v1/common/public/nations`),

  getAppInfo: (currentVersion) => baseAxios.get(`/api/v1/common/public/app`,{params: {version:currentVersion}}),

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
  getMyData: () => baseAxios.get(`/api/v1/users/mypage`),
  leaveUser: (smsVerifyKey) => baseAxios.post(`/api/v1/users/mypage/leave`, { smsVerifyKey }),
  getNotifications: () => baseAxios.get(`/api/v1/users/noti`),
  getPointHistories : (pointType,type,size,page,) => baseAxios.get(`/api/v1/users/point/history`, { params:{ point:pointType,type: type, size:size, page:page  } }),
  getNotifications : (size,page) => baseAxios.get(`/api/v1/users/noti`,{ params:{ size:size, page:page }}),
  changePassword:(password,newPassword) => baseAxios.patch(`/api/v1/users/password`,{ prev:password, new:newPassword}),
  changeSettings:(settings) => baseAxios.put(`/api/v1/users/mypage/settings`,settings),
  changeMarketingAgreement:(marketingYn) => baseAxios.patch(`/api/v1/users/mypage/marketing`,{ marketingYn:marketingYn}),

  //service
  getFaq: () => baseAxios.get(`/api/v1/service/faq`),
  getQnaNew: () => baseAxios.get(`/api/v1/service/qna/new`),
  saveQna: (payload) => baseAxios.post(`/api/v1/service/qna/new`,payload),
  getQnas: (type,size,page) => baseAxios.get(`/api/v1/service/qna`,{ params:{type:type, size:size, page:page }}),
  getQnaDetail: (qnaId) => baseAxios.get(`/api/v1/service/qna/${qnaId}`),

  //terms
  getTermsDetail: (groupId) => baseAxios.get(`/api/v1/terms/groups/${groupId}/lastest`),
  getSignUpTerms: () => baseAxios.get(`/api/v1/terms/groups/signup`),
  getAllTerms: () => baseAxios.get(`/api/v1/terms/groups/all`),

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

  requestSmsVerification: () => baseAxios.post(`/api/v1/users/verify/sms`),
  submitSmsVerification: (reqId, timestamp, tel, verify) =>
    baseAxios.post(`/api/v1/users/verify/sms/check`, {
      reqId,
      timestamp,
      tel,
      verify,
    }),
  requestEmailVerification: () => baseAxios.post(`/api/v1/users/verify/email`),
  submitEmailVerification: (reqId, timestamp, email, verify) =>
    baseAxios.post(`/api/v1/users/verify/email/check`, {
      reqId,
      timestamp,
      email,
      verify,
    }),

  //users
  logout: () => baseAxios.post(`/api/v1/users/logout`),
  getUserInfo: () => baseAxios.get(`/api/v1/users/info`),
  updateDeviceInfo: (deviceModel, deviceOs, deviceOsVersion, deviceToken) =>
    baseAxios.post(`/api/v1/users/device`, {
      deviceModel,
      deviceOs,
      deviceOsVersion,
      deviceToken,
    }),
  saveProfile: (payload) => baseAxios.post(`/api/v1/users/profile`, payload),

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
  getWalkingSummary: ()=> baseAxios.get(`/api/v1/walking/summary`),
  getWalkingHistory: (startDate,endDate)=> baseAxios.get(`/api/v1/walking/history`,{params:{
    startDate: startDate,
    endDate: endDate
  }}),

  //pet
  savePet: (payload) => baseAxios.post(`/api/v1/users/pets`, payload),
  editPet: (id, payload) => baseAxios.put(`/api/v1/users/pets/${id}`, payload),
  removePet: (id) => baseAxios.delete(`/api/v1/users/pets/${id}`),

  //community
  getUserDetail: (userId) => baseAxios.get(`/api/v1/community/users/${userId}`),
  requestFriend:(toUserId) => baseAxios.post(`/api/v1/community/friends/${toUserId}`),
  replyFriend:(toUserId,code) => baseAxios.patch(`/api/v1/community/friends/${toUserId}`,{code:code}),
  getFriends : () => baseAxios.get(`/api/v1/community/friends`),
  getPendingFriends : () => baseAxios.get(`/api/v1/community/friends/pending`),
  getCommunityData : () => baseAxios.get(`/api/v1/community`),
  getPosts : (categoryId,size,page) => baseAxios.get(`/api/v1/community/posts`,{params:{category:categoryId, size:size, page:page }}),
  getPost : (postId) => baseAxios.get(`/api/v1/community/posts/${postId}`),
  getPostFormData : (postId) => baseAxios.get(`/api/v1/community/posts/form`),
  getComments : (postId,size,page) => baseAxios.get(`/api/v1/community/posts/${postId}/comments`,{params:{size:size, page:page }}),
  changePostLike:(postId,likeYn) => baseAxios.post(`/api/v1/community/posts/${postId}/like`,{likeYn:likeYn}),
  report:(targetId,type) => baseAxios.post(`/api/v1/community/report`,{targetId,type}),
  removePost:(postId) => baseAxios.delete(`/api/v1/community/posts/${postId}`),
  saveComment:(postId,payload) => baseAxios.post(`/api/v1/community/posts/${postId}/comments`,payload),
  removeComment:(postId,commentId) => baseAxios.delete(`/api/v1/community/posts/${postId}/comments/${commentId}`),
};
