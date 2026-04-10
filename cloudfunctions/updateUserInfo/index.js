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
    const { nickName, avatarUrl } = event
    
    // 构建更新数据
    const updateData = {}
    if (nickName !== undefined) updateData.nickName = nickName
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl
    
    // 查询用户
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
    
    const userId = userResult.data[0]._id
    
    // 更新用户信息
    await db.collection('users').doc(userId).update({
      data: updateData
    })
    
    // 获取更新后的用户信息
    const updatedUser = await db.collection('users').doc(userId).get()
    
    return {
      code: 0,
      message: '更新成功',
      data: updatedUser.data
    }
    
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return {
      code: 500,
      message: '更新失败: ' + error.message,
      data: null
    }
  }
}
