/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: any,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
  setUserInfo?: (userInfo: any) => void,
  getUserInfo?: () => any,
}