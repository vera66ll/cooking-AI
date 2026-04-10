# 菜品记录小程序 - 后端功能需求文档

## 📋 概述

本文档详细列出"美食记"小程序所需的后端功能模块，可用于 CloudBase 云开发或自建后端服务。

---

## 🗄️ 一、数据库设计

### 1. 菜品集合 (dishes)

**用途：** 存储所有菜品信息

**字段结构：**
```typescript
{
  _id: string;              // 自动生成，菜品唯一ID
  _openid: string;          // 发布者用户ID（CloudBase必需）
  
  // 基本信息
  name: string;             // 菜品名称
  images: string[];         // 菜品图片URL数组
  category: string;         // 菜系分类（川菜/粤菜/湘菜等）
  description: string;      // 菜品简介
  steps: string;            // 详细做法步骤
  tags: string[];           // 标签数组
  
  // 评分系统
  rating: number;           // 平均评分（0-5）
  ratingCount: number;      // 评分人数
  ratings: [{               // 评分详情
    userId: string;
    score: number;
    createTime: number;
  }];
  
  // 作者信息
  authorId: string;         // 作者用户ID
  authorName: string;       // 作者昵称
  authorAvatar: string;     // 作者头像URL
  
  // 统计数据
  favoriteCount: number;    // 收藏数
  viewCount: number;        // 浏览数
  
  // 时间戳
  createTime: number;       // 创建时间
  updateTime: number;       // 更新时间
  
  // 状态
  status: 'published' | 'draft' | 'deleted';  // 状态
}
```

**索引建议：**
- `category` - 用于分类筛选
- `authorId` - 用于查询用户发布的菜品
- `createTime` - 用于排序
- `rating` - 用于按评分排序
- `favoriteCount` - 用于按收藏数排序

---

### 2. 用户收藏集合 (favorites)

**用途：** 记录用户收藏的菜品

**字段结构：**
```typescript
{
  _id: string;              // 自动生成
  _openid: string;          // 用户ID（CloudBase必需）
  
  dishId: string;           // 菜品ID
  dishName: string;         // 菜品名称（冗余字段，便于展示）
  dishImage: string;        // 菜品图片（冗余字段）
  
  groupName: string;        // 分组名称（如"周末想做"、"拿手菜"）
  
  createTime: number;       // 收藏时间
}
```

**索引建议：**
- `_openid + dishId` - 联合唯一索引，防止重复收藏
- `_openid + groupName` - 用于分组查询

---

### 3. 菜单集合 (menus)

**用途：** 存储用户的每日菜单安排

**字段结构：**
```typescript
{
  _id: string;              // 自动生成
  _openid: string;          // 用户ID（CloudBase必需）
  
  dishId: string;           // 菜品ID
  dishName: string;         // 菜品名称（冗余）
  dishImage: string;        // 菜品图片（冗余）
  
  mealType: 'breakfast' | 'lunch' | 'dinner';  // 餐次类型
  date: string;             // 日期（格式：YYYY-MM-DD）
  
  note: string;             // 备注（可选）
  
  createTime: number;       // 创建时间
  updateTime: number;       // 更新时间
}
```

**索引建议：**
- `_openid + date` - 用于查询某日菜单
- `_openid + date + mealType` - 联合索引，快速查询某餐

---

### 4. 用户集合 (users)

**用途：** 存储用户信息和统计数据

**字段结构：**
```typescript
{
  _id: string;              // 自动生成
  _openid: string;          // 用户ID（CloudBase必需，唯一）
  
  // 微信用户信息
  nickName: string;         // 昵称
  avatarUrl: string;        // 头像URL
  gender: number;           // 性别
  city: string;             // 城市
  province: string;         // 省份
  country: string;          // 国家
  
  // 统计数据
  publishedCount: number;   // 发布菜品数
  favoriteCount: number;    // 收藏菜品数
  totalLikes: number;       // 获赞总数
  
  // 时间戳
  createTime: number;       // 注册时间
  lastLoginTime: number;    // 最后登录时间
}
```

**索引建议：**
- `_openid` - 唯一索引

---

### 5. 评论集合 (comments)

**用途：** 存储菜品评论（预留功能）

**字段结构：**
```typescript
{
  _id: string;              // 自动生成
  _openid: string;          // 评论者ID
  
  dishId: string;           // 菜品ID
  content: string;          // 评论内容
  images: string[];         // 评论图片（可选）
  
  parentId: string;         // 父评论ID（回复功能）
  
  likeCount: number;        // 点赞数
  
  createTime: number;       // 评论时间
}
```

---

## 🔧 二、云函数/接口设计

### 1. 菜品管理模块

#### 1.1 获取菜品列表
**函数名：** `getDishList`

**功能描述：**
- 支持分页查询
- 支持按菜系筛选
- 支持按关键词搜索
- 支持多种排序（最新、最热、评分最高）

**请求参数：**
```typescript
{
  page: number;             // 页码，从1开始
  pageSize: number;         // 每页数量，默认20
  category?: string;        // 菜系筛选（可选）
  keyword?: string;         // 搜索关键词（可选）
  sortBy: 'createTime' | 'rating' | 'favoriteCount';  // 排序字段
  order: 'asc' | 'desc';    // 排序方向
}
```

**返回数据：**
```typescript
{
  code: number;             // 状态码
  message: string;          // 消息
  data: {
    list: Dish[];           // 菜品列表
    total: number;          // 总数
    page: number;           // 当前页
    pageSize: number;       // 每页数量
  }
}
```

---

#### 1.2 获取菜品详情
**函数名：** `getDishDetail`

**功能描述：**
- 根据ID获取菜品完整信息
- 增加浏览次数统计

**请求参数：**
```typescript
{
  dishId: string;           // 菜品ID
}
```

**返回数据：**
```typescript
{
  code: number;
  message: string;
  data: Dish;               // 菜品详细信息
}
```

---

#### 1.3 发布菜品
**函数名：** `createDish`

**功能描述：**
- 创建新菜品
- 自动关联当前用户
- 初始化统计数据

**请求参数：**
```typescript
{
  name: string;             // 菜品名称
  images: string[];         // 图片URL数组
  category: string;         // 菜系
  description: string;      // 描述
  steps: string;            // 做法
  tags: string[];           // 标签
}
```

**返回数据：**
```typescript
{
  code: number;
  message: string;
  data: {
    dishId: string;         // 新创建的菜品ID
  }
}
```

---

#### 1.4 更新菜品
**函数名：** `updateDish`

**功能描述：**
- 更新菜品信息
- 仅允许作者本人修改

**请求参数：**
```typescript
{
  dishId: string;
  name?: string;
  images?: string[];
  category?: string;
  description?: string;
  steps?: string;
  tags?: string[];
}
```

---

#### 1.5 删除菜品
**函数名：** `deleteDish`

**功能描述：**
- 软删除菜品（修改status为deleted）
- 仅允许作者本人删除

**请求参数：**
```typescript
{
  dishId: string;
}
```

---

#### 1.6 搜索菜品
**函数名：** `searchDishes`

**功能描述：**
- 全文搜索菜品名称、描述、标签
- 支持模糊匹配

**请求参数：**
```typescript
{
  keyword: string;          // 搜索关键词
  page: number;
  pageSize: number;
}
```

---

### 2. 收藏管理模块

#### 2.1 添加收藏
**函数名：** `addFavorite`

**功能描述：**
- 添加菜品到收藏
- 防止重复收藏
- 更新菜品收藏数

**请求参数：**
```typescript
{
  dishId: string;
  groupName?: string;       // 分组名称（可选）
}
```

---

#### 2.2 取消收藏
**函数名：** `removeFavorite`

**功能描述：**
- 取消收藏
- 更新菜品收藏数

**请求参数：**
```typescript
{
  dishId: string;
}
```

---

#### 2.3 获取收藏列表
**函数名：** `getFavoriteList`

**功能描述：**
- 获取当前用户的所有收藏
- 支持按分组筛选
- 支持分页

**请求参数：**
```typescript
{
  groupName?: string;       // 分组筛选（可选）
  page: number;
  pageSize: number;
}
```

---

#### 2.4 批量操作收藏
**函数名：** `batchUpdateFavorites`

**功能描述：**
- 批量删除收藏
- 批量移动分组

**请求参数：**
```typescript
{
  action: 'delete' | 'move';
  dishIds: string[];
  groupName?: string;       // 移动时的目标分组
}
```

---

### 3. 菜单管理模块

#### 3.1 添加菜品到菜单
**函数名：** `addToMenu`

**功能描述：**
- 将菜品添加到指定日期的某餐
- 检查是否已存在

**请求参数：**
```typescript
{
  dishId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  date: string;             // YYYY-MM-DD
  note?: string;            // 备注
}
```

---

#### 3.2 获取菜单
**函数名：** `getMenu`

**功能描述：**
- 获取指定日期的菜单
- 按早午晚餐分组返回

**请求参数：**
```typescript
{
  date: string;             // YYYY-MM-DD，默认为今天
}
```

**返回数据：**
```typescript
{
  code: number;
  data: {
    breakfast: MenuItem[];
    lunch: MenuItem[];
    dinner: MenuItem[];
  }
}
```

---

#### 3.3 从菜单移除
**函数名：** `removeFromMenu`

**功能描述：**
- 从菜单中移除菜品

**请求参数：**
```typescript
{
  menuId: string;           // 菜单记录ID
}
```

---

#### 3.4 获取推荐菜品
**函数名：** `getRecommendedDishes`

**功能描述：**
- 基于用户收藏和评分历史
- 智能推荐可能喜欢的菜品

**请求参数：**
```typescript
{
  limit: number;            // 推荐数量，默认5
}
```

---

### 4. 评分模块

#### 4.1 提交评分
**函数名：** `submitRating`

**功能描述：**
- 用户对菜品评分
- 每个用户只能评分一次
- 自动计算平均分

**请求参数：**
```typescript
{
  dishId: string;
  score: number;            // 1-5分
}
```

---

#### 4.2 获取评分详情
**函数名：** `getRatings`

**功能描述：**
- 获取菜品的所有评分
- 支持分页

**请求参数：**
```typescript
{
  dishId: string;
  page: number;
  pageSize: number;
}
```

---

### 5. 用户模块

#### 5.1 用户登录/注册
**函数名：** `userLogin`

**功能描述：**
- 微信登录获取用户信息
- 自动创建或更新用户记录
- 返回用户完整信息

**请求参数：**
```typescript
{
  code: string;             // 微信登录code
  userInfo?: {              // 用户信息（可选）
    nickName: string;
    avatarUrl: string;
    gender: number;
    city: string;
    province: string;
    country: string;
  }
}
```

---

#### 5.2 获取用户信息
**函数名：** `getUserInfo`

**功能描述：**
- 获取当前用户详细信息
- 包含统计数据

**返回数据：**
```typescript
{
  code: number;
  data: User;
}
```

---

#### 5.3 更新用户信息
**函数名：** `updateUserInfo`

**功能描述：**
- 更新昵称、头像等

**请求参数：**
```typescript
{
  nickName?: string;
  avatarUrl?: string;
}
```

---

#### 5.4 获取用户发布的菜品
**函数名：** `getUserPublishedDishes`

**功能描述：**
- 获取当前用户发布的所有菜品
- 支持分页

---

#### 5.5 获取用户统计
**函数名：** `getUserStats`

**功能描述：**
- 获取发布数、收藏数、获赞数等

---

### 6. 文件上传模块

#### 6.1 获取上传凭证
**函数名：** `getUploadToken`

**功能描述：**
- 生成云存储上传凭证
- 限制文件大小和类型

**返回数据：**
```typescript
{
  code: number;
  data: {
    token: string;
    uploadUrl: string;
  }
}
```

---

### 7. 数据统计模块

#### 7.1 热门菜品排行
**函数名：** `getHotDishes`

**功能描述：**
- 按浏览量、收藏数、评分综合排序
- 返回Top N热门菜品

**请求参数：**
```typescript
{
  limit: number;            // 默认10
  timeRange: 'week' | 'month' | 'all';  // 时间范围
}
```

---

#### 7.2 菜系统计
**函数名：** `getCategoryStats`

**功能描述：**
- 统计各菜系的菜品数量
- 用于分类页展示

---

## 🔐 三、权限控制

### 1. 数据权限规则

**菜品集合 (dishes)：**
- 所有人可读（status为published的）
- 仅作者可写
- 管理员可删除

**收藏集合 (favorites)：**
- 仅自己可读可写

**菜单集合 (menus)：**
- 仅自己可读可写

**用户集合 (users)：**
- 仅自己可读可写

---

### 2. 安全规则示例（CloudBase）

```json
{
  "dishes": {
    "read": true,
    "write": "doc._openid == auth.openid"
  },
  "favorites": {
    "read": "doc._openid == auth.openid",
    "write": "doc._openid == auth.openid"
  },
  "menus": {
    "read": "doc._openid == auth.openid",
    "write": "doc._openid == auth.openid"
  }
}
```

---

## 📊 四、API响应规范

### 统一响应格式

**成功响应：**
```typescript
{
  code: 0,                  // 0表示成功
  message: 'success',
  data: any                 // 业务数据
}
```

**失败响应：**
```typescript
{
  code: number;             // 错误码
  message: string;          // 错误信息
  data: null
}
```

### 常见错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录/认证失败 |
| 403 | 无权限操作 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 🚀 五、实施优先级

### Phase 1 - 核心功能（必须）
1. ✅ 菜品CRUD（创建、查询、更新、删除）
2. ✅ 用户登录
3. ✅ 收藏功能
4. ✅ 文件上传

### Phase 2 - 增强功能（重要）
5. ⭐ 评分系统
6. ⭐ 菜单管理
7. ⭐ 搜索功能
8. ⭐ 数据统计

### Phase 3 - 扩展功能（可选）
9. 💡 评论系统
10. 💡 分享功能
11. 💡 智能推荐
12. 💡 数据分析看板

---

## 💰 六、CloudBase 成本估算

### 免费额度（基础版）
- 数据库：5GB存储，50K读/天，50K写/天
- 云函数：40万GBs/月
- 云存储：5GB存储，10GB流量/月
- CDN：5GB流量/月

### 预估用量（1000活跃用户）
- 数据库：约2-3GB/月
- 云函数调用：约10-20万次/月
- 云存储：约5-10GB
- **结论：免费额度基本够用**

---

## 📝 七、开发建议

### 1. 数据库优化
- 合理使用索引
- 避免深度嵌套查询
- 使用聚合管道处理复杂查询

### 2. 性能优化
- 实现缓存机制（Redis）
- 图片使用CDN加速
- 分页加载，避免一次性加载大量数据

### 3. 安全建议
- 所有接口进行身份验证
- 敏感操作需要二次确认
- 定期备份数据

### 4. 监控告警
- 监控云函数调用失败率
- 监控数据库读写量
- 设置配额告警

---

## 🎯 总结

该后端方案涵盖了小程序的所有核心功能，采用模块化设计，易于扩展和维护。使用 CloudBase 可以快速上线，后期也可平滑迁移到自建服务。

**下一步行动：**
1. 在微信开发者工具中开通云开发
2. 创建数据库集合
3. 部署云函数
4. 前端接入云端API
