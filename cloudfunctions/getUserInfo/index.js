// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  try {
    // 查询用户信息
    const userResult = await db.collection('users').where({
      _openid: openid
    }).get()
    
    if (userResult.data.length === 0) {
      return {
        code: 404,
        message: '用户不存在',
        data: null
      }
    }
    
    const user = userResult.data[0]
    
    // 获取用户的统计数据
    const dishesCount = await db.collection('dishes').where({
      _openid: openid,
      status: 'published'
    }).count()
    
    const favoritesCount = await db.collection('favorites').where({
      _openid: openid
    }).count()
    
    return {
      code: 0,
      message: 'success',
      data: {
        ...user,
        publishedCount: dishesCount.total,
        favoriteCount: favoritesCount.total
      }
    }
    
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return {
      code: 500,
      message: '获取用户信息失败: ' + error.message,
      data: null
    }
  }
}
