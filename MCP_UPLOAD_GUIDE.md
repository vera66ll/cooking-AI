# 🚀 CloudBase MCP 上传云函数指南

## 📋 您已配置 CloudBase MCP，现在有3种上传方式：

---

## ⚡ 方式一：使用自动化脚本（最简单）

### 步骤1：运行上传脚本

在 PowerShell 中执行：

```powershell
cd "d:\software-address\wechat-develop\project-folder\miniprogram-1"
.\upload-cloud-functions.ps1
```

**脚本会自动：**
- ✅ 检测是否安装 CloudBase CLI
- ✅ 引导您登录
- ✅ 依次上传4个云函数
- ✅ 可选初始化数据库
- ✅ 显示详细进度和结果

### 如果提示未安装 Node.js

需要先安装 Node.js：
1. 访问 https://nodejs.org/
2. 下载并安装 LTS 版本
3. 重新运行脚本

---

## 🎯 方式二：使用微信开发者工具（无需安装任何工具）

### 第1步：设置环境
```
右键 cloudfunctions 文件夹
→ 当前环境
→ 选择: vera-liu-space-6g2h5zpq5043f8fe
```

### 第2步：上传云函数（每个都要做）

依次右键以下文件夹，选择"上传并部署：云端安装依赖"：

1. `cloudfunctions/initDatabase`
2. `cloudfunctions/userLogin`
3. `cloudfunctions/getUserInfo`
4. `cloudfunctions/updateUserInfo`

**预计时间：** 每个约15-20秒，总共1-2分钟

---

## 💻 方式三：使用 CloudBase CLI 命令

如果您已安装 Node.js 和 CloudBase CLI：

### 安装 CLI（仅需一次）
```bash
npm install -g @cloudbase/cli
```

### 登录
```bash
tcb login
```

### 上传所有云函数
```bash
cd "d:\software-address\wechat-develop\project-folder\miniprogram-1"

tcb functions:deploy initDatabase --force
tcb functions:deploy userLogin --force
tcb functions:deploy getUserInfo --force
tcb functions:deploy updateUserInfo --force
```

### 初始化数据库
```bash
tcb functions:invoke initDatabase
```

---

## ✅ 验证上传成功

### 方法1：查看云开发控制台
1. 微信开发者工具 → 点击"云开发"
2. 进入"云函数"页面
3. 应该看到4个函数，状态都是"部署成功"

### 方法2：测试调用
在小程序控制台执行：

```javascript
// 测试登录
wx.cloud.callFunction({ name: 'userLogin' })
  .then(res => console.log('✅ 成功:', res));

// 初始化数据库
wx.cloud.callFunction({ name: 'initDatabase' })
  .then(res => console.log('✅ 数据库:', res));
```

---

## 🗄️ 数据库初始化

上传完成后，必须初始化数据库：

### 在微信开发者工具控制台执行：
```javascript
wx.cloud.callFunction({ 
  name: 'initDatabase' 
}).then(res => {
  console.log('结果:', res);
});
```

**预期输出：**
```
{
  code: 0,
  message: "数据库初始化完成",
  data: {
    results: [
      { collection: "users", status: "created" },
      { collection: "dishes", status: "created" },
      { collection: "favorites", status: "created" },
      { collection: "menus", status: "created" },
      { collection: "comments", status: "created" }
    ]
  }
}
```

---

## 🔧 常见问题

### Q1: PowerShell 脚本无法运行？

**错误信息：** "无法加载文件，因为在此系统上禁止运行脚本"

**解决方法：**
```powershell
# 以管理员身份运行 PowerShell，然后执行：
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

或者直接使用方法二（微信开发者工具）

### Q2: 上传时提示"未授权"？

**解决：**
1. 确认已登录：`tcb login`
2. 检查环境ID是否正确
3. 确认有该环境的操作权限

### Q3: 上传超时或失败？

**解决：**
1. 检查网络连接
2. 重试上传
3. 使用微信开发者工具手动上传

### Q4: 如何查看上传日志？

**位置：**
- 云开发控制台 → 云函数 → 选择函数 → 日志
- 或在微信开发者工具底部面板查看

---

## 📊 上传清单

上传前确认：
- [ ] 环境ID已配置：`vera-liu-space-6g2h5zpq5043f8fe`
- [ ] cloudfunctions 目录存在
- [ ] 4个云函数文件夹都存在

上传后确认：
- [ ] initDatabase 上传成功
- [ ] userLogin 上传成功
- [ ] getUserInfo 上传成功
- [ ] updateUserInfo 上传成功
- [ ] 数据库已初始化
- [ ] 小程序运行无错误

---

## 💡 推荐流程

**最快方式（2-3分钟）：**
1. 打开微信开发者工具
2. 右键 cloudfunctions → 设置环境
3. 依次上传4个云函数
4. 控制台执行初始化
5. 完成！✅

**自动化方式（需Node.js）：**
1. 运行 `.\upload-cloud-functions.ps1`
2. 按提示操作
3. 自动完成所有步骤

---

## 🎊 完成后

您的小程序将具备：
- ✅ 云端用户管理
- ✅ 自动登录功能
- ✅ 云数据库支持
- ✅ 可扩展的云函数架构

下一步可以实现：
- 菜品管理云函数
- 收藏功能
- 菜单管理
- 图片上传

祝您顺利！🚀
