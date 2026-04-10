Page({
  data: {
    phone: '',
    password: '',
    phoneError: '',
    passwordError: '',
    showPassword: false,
    rememberMe: false,
    isLoading: false,
    isWxLoading: false,
  },

  onLoad() {
    // 读取"记住我"状态
    const rememberMe = wx.getStorageSync('rememberLogin') || false;
    const savedPhone = wx.getStorageSync('savedPhone') || '';
    this.setData({ rememberMe, phone: savedPhone });
  },

  // ===== 手机号 =====
  onPhoneInput(e: any) {
    const phone = e.detail.value;
    this.setData({ phone, phoneError: '' });
  },

  onPhoneFocus() {
    this.setData({ phoneError: '' });
  },

  onPhoneBlur() {
    this.validatePhone();
  },

  clearPhone() {
    this.setData({ phone: '', phoneError: '' });
  },

  validatePhone(): boolean {
    const { phone } = this.data;
    if (!phone) {
      this.setData({ phoneError: '请输入手机号' });
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      this.setData({ phoneError: '请输入正确的手机号格式' });
      return false;
    }
    this.setData({ phoneError: '' });
    return true;
  },

  // ===== 密码 =====
  onPasswordInput(e: any) {
    const password = e.detail.value;
    this.setData({ password, passwordError: '' });
  },

  onPasswordFocus() {
    this.setData({ passwordError: '' });
  },

  onPasswordBlur() {
    this.validatePassword();
  },

  togglePassword() {
    this.setData({ showPassword: !this.data.showPassword });
  },

  validatePassword(): boolean {
    const { password } = this.data;
    if (!password) {
      this.setData({ passwordError: '请输入密码' });
      return false;
    }
    if (password.length < 6) {
      this.setData({ passwordError: '密码长度不能少于6位' });
      return false;
    }
    this.setData({ passwordError: '' });
    return true;
  },

  // ===== 记住我 =====
  toggleRemember() {
    const rememberMe = !this.data.rememberMe;
    this.setData({ rememberMe });
  },

  // ===== 忘记密码 =====
  onForgotPassword() {
    wx.showToast({ title: '请联系客服找回密码', icon: 'none', duration: 2000 });
  },

  // ===== 手机号+密码登录 =====
  onLogin() {
    const phoneOk = this.validatePhone();
    const passwordOk = this.validatePassword();
    if (!phoneOk || !passwordOk) return;

    // 手机号+密码登录预留扩展接口（后端尚未实现时给予友好提示）
    wx.showToast({ title: '该登录方式正在开发中', icon: 'none', duration: 2000 });
  },

  // ===== 微信一键登录（主流程）=====
  onWechatLogin() {
    if (this.data.isWxLoading) return;
    this.setData({ isWxLoading: true });

    wx.getUserProfile({
      desc: '用于完善个人信息',
      success: (profileRes: any) => {
        const userInfo = profileRes.userInfo;

        wx.cloud.callFunction({
          name: 'userLogin',
          data: { userInfo },
        }).then((result: any) => {
          if (result.result && result.result.code === 0) {
            const { userInfo: savedUser } = result.result.data;

            // 更新全局状态
            const app = getApp() as any;
            app.setUserInfo(savedUser);

            // 处理"记住我"
            if (this.data.rememberMe) {
              wx.setStorageSync('rememberLogin', true);
              wx.setStorageSync('savedPhone', this.data.phone);
            } else {
              wx.removeStorageSync('rememberLogin');
              wx.removeStorageSync('savedPhone');
            }

            wx.showToast({ title: '登录成功', icon: 'success', duration: 1000 });

            setTimeout(() => {
              wx.switchTab({ url: '/pages/index/index' });
            }, 800);
          } else {
            wx.showToast({ title: result.result?.message || '登录失败', icon: 'none' });
          }
        }).catch((err: any) => {
          console.error('登录失败:', err);
          wx.showToast({ title: '网络异常，请重试', icon: 'none' });
        }).finally(() => {
          this.setData({ isWxLoading: false });
        });
      },
      fail: () => {
        this.setData({ isWxLoading: false });
        wx.showToast({ title: '已取消授权', icon: 'none' });
      },
    });
  },
});
