//index.js
const app = getApp()
const activeApi = require('../../api/activeApi')
Page({
  data: {
    avatarUrl: '',
    userInfo: {},

    isShowAdd: false
  },

  onLoad: function() {
    app.getUserInfo().then(res => {
      
      if( app.globalData.userInfo){
        this.setData({
          avatarUrl: app.globalData.userInfo.avatarUrl,
          userInfo: app.globalData.userInfo
        })
      }
    })
   
  },


  onGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      this.setData({
   
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      app.globalData.userInfo = e.detail.userInfo
    }
  },

  toAdd(){
    
    if(app.globalData.userInfo){
      wx.navigateTo({
        url: '/pages/addActive/addActive'
      })
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  toMyActive(){
    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/activeList/activeList?type=myActive'
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  toMyJoin(){
    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/activeList/activeList?type=myJoinActive'
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  onShow(){
    if( app.globalData.userInfo){
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        userInfo: app.globalData.userInfo
      })
    }
  }

})
