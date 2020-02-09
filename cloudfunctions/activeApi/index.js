// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  switch(event.methodName){
    case 'getActive':
      return  getActive(event.activeId)
      break
      case 'getMyActive':

        return  getMyActive(openid , event.pageNum , event.pageSize)
        break
      case 'getMyJoinActive':
         return  getMyJoinActive(openid , event.pageNum , event.pageSize)
          break
  }
 
}

const getActive = async (activeId) => {

  var result = await db.collection('active').aggregate()
              .match({
                _id: activeId 
              })
          
              .lookup({
                from: 'join',
                localField: '_id',
                foreignField: 'activeId',
                as: 'joinList',
              })
              .end()
      return result;
}
const getMyActive = async (openid,pageNum,pageSize) => {
  var skip = (pageNum - 1) * pageSize
  return await db.collection('active').aggregate()
  .match({
    openid: openid 
  })
  .sort({
      createDate: -1
  })
  .skip(skip)
  
  .limit(pageSize)
  .lookup({
    from: 'join',
    localField: '_id',
    foreignField: 'activeId',
    as: 'joinList',
  })
  .end()
}
const getMyJoinActive = async (openid,pageNum,pageSize) => {
  var skip = (pageNum - 1) * pageSize
  return await db.collection('join').aggregate()
  .match({
    openid: openid 
  })
  .sort({
    createDate: -1
  })
  .skip(skip)
 
  .limit(pageSize)
  .lookup({
    from: 'active',
    localField: 'activeId',
    foreignField: '_id',
    as: 'activeList',
  })
  .end()
}