# 🚀 CloudBase 快速开始 - 3步搞定

## ⚡ 超简配置（3步完成）

### 第1步：开通云开发（2分钟）
```
微信开发者工具 
→ 点击顶部"云开发"按钮 
→ 开通服务 
→ 选择"基础版"（免费）
→ 等待创建完成
```

### 第2步：复制环境ID（10秒）
```
云开发控制台 
→ 左上角"环境" 
→ 复制环境ID（类似：cloud1-xxx）
```

### 第3步：修改代码（30秒）
打开 `miniprogram/app.ts`，找到第10行：
```typescript
env: 'your-env-id',  // ← 改成你的环境ID
```

---

## 📤 上传云函数（1分钟）

在微信开发者工具中：

1. **设置环境**
   ```
   右键 cloudfunctions 文件夹 
   → 当前环境 
   → 选择你的环境
   ```

2. **上传函数**（每个都要做）
   ```
   右键 userLogin 文件夹 
   → 上传并部署：云端安装依赖
   
   右键 getUserInfo 文件夹 
   → 上传并部署：云端安装依赖
   
   右键 updateUserInfo 文件夹 
   → 上传并部署：云端安装依赖
   
   右键 initDatabase 文件夹 
   → 上传并部署：云端安装依赖
   ```

---

## 🗄️ 初始化数据库（30秒）

在微信开发者工具的**控制台**（Console）中输入：

```javascript
wx.cloud.callFunction({ name: 'initDatabase' })
  .then(res => console.log('成功:', res))
  .catch(err => console.error('失败:', err));
```

看到成功提示就完成了！

---

## ✅ 测试验证

编译运行小程序，查看控制台：

```
✅ 看到 "自动登录成功" = 配置正确！
❌ 看到错误 = 检查环境ID和云函数是否上传
```

---

## 🎯 完成！

现在你的小程序已经：
- ✅ 连接云端数据库
- ✅ 自动用户登录
- ✅ 云端数据同步
- ✅ 可以使用所有云功能

---

## 📖 详细文档

遇到问题？查看详细指南：
- [CLOUDBASE_SETUP.md](./CLOUDBASE_SETUP.md) - 完整配置教程
- [CLOUDBASE_INTEGRATION_COMPLETE.md](./CLOUDBASE_INTEGRATION_COMPLETE.md) - 集成报告

---

## 💡 提示

**总耗时：约5分钟**

如果遇到问题：
1. 检查环境ID是否正确
2. 确认云函数已上传成功
3. 查看云开发控制台的日志
4. 重启微信开发者工具

祝顺利！🎉
