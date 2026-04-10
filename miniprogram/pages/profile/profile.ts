import { storage } from '../../utils/storage';

Page({
  data: {
    userInfo: {
      avatar: 'https://picsum.photos/200/200?random=user',
      nickname: '微信用户',
      publishedCount: 0,
      favoriteCount: 0,
      totalLikes: 0
    },
    isLoading: false,
    showLogoutModal: false
  },

  onShow() {
    this.loadUserInfo();
  },

  /**
   * 从云端加载用户信息
   */
  loadUserInfo() {
    this.setData({ isLoading: true });
    
    // 先尝试从缓存读取
    const cachedUser = wx.getStorageSync('userInfo');
    if (cachedUser) {
      this.setData({
        userInfo: {
          avatar: cachedUser.avatarUrl || cachedUser.avatar,
          nickname: cachedUser.nickName || cachedUser.nickname,
          publishedCount: cachedUser.publishedCount || 0,
          favoriteCount: cachedUser.favoriteCount || 0,
          totalLikes: cachedUser.totalLikes || 0
        }
      });
    }
    
    // 调用云函数获取最新数据
    wx.cloud.callFunction({
      name: 'getUserInfo'
    }).then((res: any) => {
      if (res.result && res.result.code === 0) {
        const user = res.result.data;
        
        this.setData({
          userInfo: {
            avatar: user.avatarUrl || user.avatar,
            nickname: user.nickName || user.nickname,
            publishedCount: user.publishedCount || 0,
            favoriteCount: user.favoriteCount || 0,
            totalLikes: user.totalLikes || 0
          }
        });
        
        // 更新缓存
        wx.setStorageSync('userInfo', user);
        
        // 更新全局数据
        const app = getApp() as any;
        app.setUserInfo(user);
      }
    }).catch((err) => {
      console.error('获取用户信息失败:', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    }).finally(() => {
      this.setData({ isLoading: false });
    });
  },

  onMyPublished() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  onMyFavorites() {
    wx.switchTab({ url: '/pages/favorite/favorite' });
  },

  onMyRatings() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  onSettings() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  /**
   * 退出登录
   */
  onLogout() {
    this.setData({ showLogoutModal: true });
  },

  /**
   * 取消登出
   */
  onLogoutCancel() {
    this.setData({ showLogoutModal: false });
  },

  /**
   * 确认登出
   */
  onLogoutConfirm() {
    this.setData({ showLogoutModal: false });
    this.performLogout();
  },

  /**
   * 执行登出操作
   */
  performLogout() {
    wx.showLoading({ title: '退出中...' });

    try {
      // 清除本地存储的用户信息
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('rememberedPhone');
      wx.removeStorageSync('rememberedPassword');

      // 重置全局用户信息
      const app = getApp<IAppOption>();
      app.setUserInfo?.(null);

      wx.hideLoading();

      wx.showToast({
        title: '已退出登录',
        icon: 'success',
        duration: 1500
      });

      // 延迟跳转到登录页面
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/login/login'
        });
      }, 1500);
    } catch (error) {
      console.error('退出登录失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '退出失败，请重试',
        icon: 'none'
      });
    }
  }
});
