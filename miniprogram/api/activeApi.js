
const db = wx.cloud.database()
const collectionName = 'active'
module.exports = {
  addActive:function(data){
    return new Promise((resolve,reject) => {
      db.collection(collectionName).add({
        data:{
          openid: data.openid,
          avatarUrl : data.avatarUrl,
          nickName : data.nickName,
          content: data.content,
          fileList: data.fileList,
          imgList: data.imgList,
          date: data.date,
          address: data.address,
          location: new db.Geo.Point(data.longitude, data.latitude),
          createDate: new Date()
        }
      })
      .then(res => {
        console.log(res)
        resolve(res._id)
      })
      .catch(console.error)
    })
    
  },
  getActive:function(_id){
    return new Promise((resovle,reject) => {
      wx.cloud.callFunction({
        name: 'activeApi',
        data: {
          methodName: 'getActive',
          activeId: _id
        }
      }).then(res => {
        resovle(res.result.list)
      })

    })
  },
  joinActive:function(data){
    return new Promise((resolve,reject) => {
      db.collection('join').add({
        data: {
          openid: data.openid,
          avatarUrl : data.avatarUrl,
          nickName : data.nickName,
          activeId: data.activeId,
          createDate: new Date()
        }
      }).then(res => {
        resolve(res._id)
      })
    })
  },
  getMyActive:function(param){
    return new Promise((resolve,reject) => {
      wx.cloud.callFunction({
        name: 'activeApi',
        data: {
          methodName: 'getMyActive',
          pageNum : param.pageNum,
          pageSize : param.pageSize
        }
   
      }).then(res => {
        resolve(res.result.list)
      })
    })
  },
  getMyJoinActive:function(param){
    
    return new Promise((resolve,reject) => {
      wx.cloud.callFunction({
        name: 'activeApi',
        data: {
          methodName: 'getMyJoinActive',
          pageNum : param.pageNum,
          pageSize : param.pageSize
        }
    
      }).then(res => {
        resolve(res.result.list)
      })
    })
  },
  getIsShow:function(){
    return new Promise((resolve, reject) => {
      db.collection('show') .get().then(res => {
        
        resolve(res.data)
        
      })
    })
  }
}