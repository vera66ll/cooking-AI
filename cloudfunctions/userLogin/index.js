// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  try {
    // 查询用户是否存在
    const userResult = await db.collection('users').where({
      _openid: openid
    }).get()
    
    let user
    
    if (userResult.data.length === 0) {
      // 用户不存在，创建新用户
      const userData = {
        _openid: openid,
        nickName: event.userInfo?.nickName || '微信用户',
        avatarUrl: event.userInfo?.avatarUrl || '',
        gender: event.userInfo?.gender || 0,
        city: event.userInfo?.city || '',
        province: event.userInfo?.province || '',
        country: event.userInfo?.country || '',
        publishedCount: 0,
        favoriteCount: 0,
        totalLikes: 0,
        createTime: Date.now(),
        lastLoginTime: Date.now()
      }
      
      const addResult = await db.collection('users').add({
        data: userData
      })
      
      user = {
        ...userData,
        _id: addResult._id
      }
    } else {
      // 用户已存在，更新最后登录时间
      user = userResult.data[0]
      
      await db.collection('users').doc(user._id).update({
        data: {
          lastLoginTime: Date.now(),
          // 如果传入了新的用户信息，则更新
          ...(event.userInfo?.nickName && { nickName: event.userInfo.nickName }),
          ...(event.userInfo?.avatarUrl && { avatarUrl: event.userInfo.avatarUrl })
        }
      })
      
      // 重新获取最新用户信息
      const updatedUser = await db.collection('users').doc(user._id).get()
      user = updatedUser.data
    }
    
    return {
      code: 0,
      message: '登录成功',
      data: {
        userInfo: user,
        openid: openid
      }
    }
    
  } catch (error) {
    console.error('登录失败:', error)
    return {
      code: 500,
      message: '登录失败: ' + error.message,
      data: null
    }
  }
}
