// app.ts
App<IAppOption>({
  globalData: {
    userInfo: null as any
  },
  
  onLaunch() {
    // 初始化云开发环境
    wx.cloud.init({
      env: 'your-env-id', // TODO: 替换为您的云环境ID
      traceUser: true
    });

    // 自动登录
    const self = this;
    wx.cloud.callFunction({
      name: 'userLogin'
    }).then((result: any) => {
      if (result.result && result.result.code === 0) {
        const { userInfo } = result.result.data;
        self.globalData.userInfo = userInfo;
        
        // 缓存用户信息
        wx.setStorageSync('userInfo', userInfo);
        
        console.log('自动登录成功');
      }
    }).catch((error) => {
      console.error('自动登录失败:', error);
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return this.globalData.userInfo;
  },

  /**
   * 更新用户信息
   */
  setUserInfo(userInfo: any) {
    this.globalData.userInfo = userInfo;
    if (userInfo) {
      wx.setStorageSync('userInfo', userInfo);
    } else {
      wx.removeStorageSync('userInfo');
    }
  }
})