// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const collections = [
    'users',
    'dishes',
    'favorites',
    'menus',
    'comments'
  ]
  
  const results = []
  
  try {
    for (const collectionName of collections) {
      try {
        // 尝试创建集合
        await db.createCollection(collectionName)
        results.push({
          collection: collectionName,
          status: 'created',
          message: '集合创建成功'
        })
      } catch (err) {
        // 集合已存在
        if (err.errCode === -502005) {
          results.push({
            collection: collectionName,
            status: 'exists',
            message: '集合已存在'
          })
        } else {
          results.push({
            collection: collectionName,
            status: 'error',
            message: err.message
          })
        }
      }
    }
    
    return {
      code: 0,
      message: '数据库初始化完成',
      data: {
        results: results,
        totalCollections: collections.length,
        successCount: results.filter(r => r.status !== 'error').length
      }
    }
    
  } catch (error) {
    console.error('初始化数据库失败:', error)
    return {
      code: 500,
      message: '初始化失败: ' + error.message,
      data: null
    }
  }
}
