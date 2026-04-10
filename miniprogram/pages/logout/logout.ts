Page({
  data: {
    userInfo: null as any,
    isLoading: false,
  },

  onLoad() {
    // 读取当前用户信息用于展示
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  // 取消 - 返回上一页
  onCancel() {
    wx.navigateBack({ delta: 1 });
  },

  // 确认退出登录
  onConfirmLogout() {
    if (this.data.isLoading) return;
    this.setData({ isLoading: true });

    // 清除本地缓存
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('rememberLogin');
    wx.removeStorageSync('savedPhone');

    // 清除全局状态
    const app = getApp() as any;
    if (app && app.setUserInfo) {
      app.setUserInfo(null);
    }

    wx.showToast({ title: '已退出登录', icon: 'success', duration: 800 });

    setTimeout(() => {
      // 重启到登录页
      wx.reLaunch({ url: '/pages/login/login' });
    }, 600);
  },
});
