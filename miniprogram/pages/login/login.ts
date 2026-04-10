// pages/login/login.ts
import { CloudBase } from '../../utils/cloudbase';

interface LoginData {
  phone: string;
  password: string;
  rememberMe: boolean;
  loading: boolean;
  errors: {
    phone: string;
    password: string;
  };
}

Page({
  data: {
    phone: '',
    password: '',
    rememberMe: false,
    loading: false,
    errors: {
      phone: '',
      password: ''
    }
  } as LoginData,

  onLoad() {
    // 检查是否已经登录
    const app = getApp<IAppOption>();
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    
    if (userInfo) {
      // 已登录，直接跳转到首页
      wx.switchTab({
        url: '/pages/index/index'
      });
      return;
    }
    
    // 检查是否有记住的登录信息
    this.checkRememberedLogin();
  },

  /**
   * 检查记住的登录信息
   */
  checkRememberedLogin() {
    const rememberedPhone = wx.getStorageSync('rememberedPhone');
    const rememberedPassword = wx.getStorageSync('rememberedPassword');
    
    if (rememberedPhone && rememberedPassword) {
      this.setData({
        phone: rememberedPhone,
        password: rememberedPassword,
        rememberMe: true
      });
    }
  },

  /**
   * 手机号输入
   */
  onPhoneInput(e: any) {
    const phone = e.detail.value;
    this.setData({
      phone,
      'errors.phone': '' // 清除错误提示
    });
  },

  /**
   * 密码输入
   */
  onPasswordInput(e: any) {
    const password = e.detail.value;
    this.setData({
      password,
      'errors.password': '' // 清除错误提示
    });
  },

  /**
   * 记住我选项变化
   */
  onRememberChange(e: any) {
    this.setData({
      rememberMe: e.detail.value.length > 0
    });
  },

  /**
   * 验证表单
   */
  validateForm(): boolean {
    const { phone, password } = this.data;
    const errors = {
      phone: '',
      password: ''
    };
    let isValid = true;

    // 验证手机号
    if (!phone) {
      errors.phone = '请输入手机号';
      isValid = false;
    } else if (!/^1[3-9]\d{9}$/.test(phone)) {
      errors.phone = '请输入正确的手机号';
      isValid = false;
    }

    // 验证密码
    if (!password) {
      errors.password = '请输入密码';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = '密码至少6位';
      isValid = false;
    }

    this.setData({ errors });
    return isValid;
  },

  /**
   * 账号密码登录
   */
  async onLogin() {
    // 验证表单
    if (!this.validateForm()) {
      return;
    }

    this.setData({ loading: true });

    try {
      // TODO: 这里需要调用实际的登录云函数
      // 目前项目使用的是微信自动登录，如果需要账号密码登录，需要创建新的云函数
      const result = await CloudBase.callFunction('userLogin', {
        loginType: 'password',
        phone: this.data.phone,
        password: this.data.password
      });

      if (result.code === 0 && result.data) {
        // 登录成功
        const { userInfo } = result.data;
        
        // 保存用户信息到全局
        const app = getApp<IAppOption>();
        app.setUserInfo?.(userInfo);

        // 如果选择了"记住我"，保存登录信息
        if (this.data.rememberMe) {
          wx.setStorageSync('rememberedPhone', this.data.phone);
          wx.setStorageSync('rememberedPassword', this.data.password);
        } else {
          // 否则清除之前保存的信息
          wx.removeStorageSync('rememberedPhone');
          wx.removeStorageSync('rememberedPassword');
        }

        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });

        // 延迟跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      } else {
        // 登录失败
        wx.showToast({
          title: result.message || '登录失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('登录失败:', error);
      wx.showToast({
        title: '网络请求失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 微信一键登录
   */
  async onWechatLogin(e: any) {
    if (e.detail.userInfo) {
      this.setData({ loading: true });

      try {
        const userInfo = e.detail.userInfo;
        
        // 调用云函数进行微信登录
        const result = await CloudBase.userLogin(userInfo);

        if (result.code === 0 && result.data) {
          // 登录成功
          const { userInfo: userData } = result.data;
          
          // 保存用户信息到全局
          const app = getApp<IAppOption>();
          app.setUserInfo?.(userData);

          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });

          // 延迟跳转到首页
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 1500);
        } else {
          wx.showToast({
            title: result.message || '登录失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('微信登录失败:', error);
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
      } finally {
        this.setData({ loading: false });
      }
    } else {
      // 用户拒绝授权
      wx.showToast({
        title: '您取消了授权',
        icon: 'none'
      });
    }
  },

  /**
   * 忘记密码
   */
  onForgotPassword() {
    wx.showToast({
      title: '请联系客服重置密码',
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 注册
   */
  onRegister() {
    wx.showToast({
      title: '注册功能开发中',
      icon: 'none'
    });
  }
});
