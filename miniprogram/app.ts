// app.ts
App<IAppOption>({
  globalData: {
    userInfo: null as any
  },
  
  onLaunch() {
    // 初始化云开发环境
    wx.cloud.init({
      env: 'vera-liu-space-6g2h5zpq5043f8fe',
      traceUser: true
    });

    // 检测是否已登录，已登录则跳过登录页直接进入首页
    const cachedUserInfo = wx.getStorageSync('userInfo');
    const rememberLogin = wx.getStorageSync('rememberLogin');
    
    if (cachedUserInfo && rememberLogin) {
      this.globalData.userInfo = cachedUserInfo;
      // 跳转首页（延迟确保小程序初始化完成）
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 100);
      return;
    }

    // 未登录，调用云函数静默登录（获取 openid 注册用户）
    const self = this;
    wx.cloud.callFunction({
      name: 'userLogin'
    }).then((result: any) => {
      if (result.result && result.result.code === 0) {
        const { userInfo } = result.result.data;
        self.globalData.userInfo = userInfo;
        wx.setStorageSync('userInfo', userInfo);
        console.log('静默登录成功');
      }
    }).catch((error) => {
      console.error('静默登录失败:', error);
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