# 📤 云函数上传指南

## ⚡ 快速上传（推荐方式）

### 方法一：使用微信开发者工具（最简单）

#### 步骤1：设置云环境
1. 在微信开发者工具中，**右键点击** `cloudfunctions` 文件夹
2. 选择 **"当前环境"**
3. 选择您的环境：`vera-liu-space-6g2h5zpq5043f8fe`

#### 步骤2：依次上传每个云函数

对以下**每个文件夹**执行相同操作：

**① 上传 userLogin**
```
右键 cloudfunctions/userLogin 文件夹
→ 选择 "上传并部署：云端安装依赖"
→ 等待上传完成（约10-20秒）
→ 看到 "上传成功" 提示
```

**② 上传 getUserInfo**
```
右键 cloudfunctions/getUserInfo 文件夹
→ 选择 "上传并部署：云端安装依赖"
→ 等待上传完成
```

**③ 上传 updateUserInfo**
```
右键 cloudfunctions/updateUserInfo 文件夹
→ 选择 "上传并部署：云端安装依赖"
→ 等待上传完成
```

**④ 上传 initDatabase**
```
右键 cloudfunctions/initDatabase 文件夹
→ 选择 "上传并部署：云端安装依赖"
→ 等待上传完成
```

---

### 方法二：使用命令行（高级用户）

如果您安装了 CloudBase CLI，可以使用命令上传：

```bash
# 安装 CloudBase CLI
npm install -g @cloudbase/cli

# 登录
tcb login

# 切换到云函数目录
cd cloudfunctions

# 上传所有云函数
tcb functions:deploy userLogin
tcb functions:deploy getUserInfo
tcb functions:deploy updateUserInfo
tcb functions:deploy initDatabase
```

---

## ✅ 验证上传成功

### 检查方式1：在微信开发者工具中查看
1. 点击顶部菜单栏的 **"云开发"**
2. 进入 **"云函数"** 页面
3. 应该能看到4个云函数：
   - ✅ userLogin
   - ✅ getUserInfo
   - ✅ updateUserInfo
   - ✅ initDatabase
4. 状态显示为 **"部署成功"**

### 检查方式2：测试调用
在小程序任意页面的控制台执行：

```javascript
// 测试 userLogin
wx.cloud.callFunction({
  name: 'userLogin'
}).then(res => {
  console.log('✅ userLogin 调用成功:', res);
}).catch(err => {
  console.error('❌ userLogin 调用失败:', err);
});

// 测试 initDatabase
wx.cloud.callFunction({
  name: 'initDatabase'
}).then(res => {
  console.log('✅ initDatabase 调用成功:', res);
}).catch(err => {
  console.error('❌ initDatabase 调用失败:', err);
});
```

---

## 🔧 常见问题

### Q1: 上传时提示"未选择环境"？
**解决：**
```
右键 cloudfunctions 文件夹 
→ 当前环境 
→ 选择 vera-liu-space-6g2h5zpq5043f8fe
```

### Q2: 上传失败或超时？
**解决：**
1. 检查网络连接
2. 重启微信开发者工具
3. 确认已开通云开发服务
4. 查看云开发控制台的日志

### Q3: 上传成功但调用失败？
**解决：**
1. 检查云函数日志（云开发控制台 → 云函数 → 日志）
2. 确认环境ID正确
3. 检查云函数是否有语法错误

### Q4: 如何查看上传进度？
**查看位置：**
```
微信开发者工具底部面板 
→ 云函数上传日志
```

---

## 📊 上传后下一步

上传完成后，执行数据库初始化：

### 在控制台执行：
```javascript
wx.cloud.callFunction({
  name: 'initDatabase'
}).then(res => {
  console.log('数据库初始化结果:', res);
  if (res.result && res.result.code === 0) {
    console.log('✅ 数据库初始化成功！');
    console.log('创建的集合:', res.result.data.results);
  }
});
```

### 预期输出：
```
数据库初始化结果: {
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

## 🎯 完成标志

当您看到以下内容时，说明全部完成：

- ✅ 4个云函数都已上传成功
- ✅ 云开发控制台能看到所有函数
- ✅ 数据库初始化成功
- ✅ 小程序运行无错误
- ✅ 控制台显示"自动登录成功"

---

## 💡 提示

**预计耗时：** 每个云函数约10-20秒，总共约1-2分钟

**上传顺序：** 建议按以下顺序上传
1. initDatabase（先创建数据库）
2. userLogin（用户登录）
3. getUserInfo（获取信息）
4. updateUserInfo（更新信息）

祝您上传顺利！🚀
