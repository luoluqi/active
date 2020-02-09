const app = getApp()
const activeApi = require('../../api/activeApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
   active: null,
   imgList: [],
   isJoin:false,
   joinList: [],
    shareImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var activeId = ''
    if (options.scene){
      var scene = decodeURIComponent(options.scene);
      activeId = scene
    }else{
      activeId = options.activeId
    }
   
    if(activeId){
      this.getActive(activeId)
    }else{
    
    }
   

  
  },
  getActive(activeId){
    wx.showLoading({
      mask:true
    })
    activeApi.getActive(activeId).then(data => {
      wx.hideLoading( )
      var imgList = data[0].imgList;
      if(typeof imgList == 'string'){
        imgList = imgList.split(',')
      }
      this.setData({
        active : data[0],
        imgList: imgList,
        joinList:data[0].joinList
      })
     //判断是否参加
      this.checkJoin()

      //创建分享图
      app.createShareImg(this.data.active).then(path => {
        this.setData({
          shareImg: path
        });
      })
   
    })
  },
  checkJoin(){
    app.getOpenid().then(res => {
      for(var item of this.data.joinList){
        if(item._openid == app.globalData.openid){
          this.setData({
            isJoin:true
          })
          break
        }
      }
    })
  },
  
  previewImage(e){
    var url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: this.data.imgList,
      current: url
    })
  },
  openLocation(){
    
    wx.openLocation({
      latitude: this.data.active.location.coordinates[1],
      longitude: this.data.active.location.coordinates[0]
    })
  },

  join(){
    if(!app.globalData.userInfo){
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
   wx.showLoading({
     mask:true
   })
    activeApi.joinActive({
      openid : app.globalData.openid,
      avatarUrl : app.globalData.userInfo.avatarUrl,
      nickName : app.globalData.userInfo.nickName,
      activeId: this.data.active._id
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '已报名参加',
      })
      this.data.joinList.unshift({
        avatarUrl : app.globalData.userInfo.avatarUrl,
        nickName : app.globalData.userInfo.nickName
      })
      this.setData({
        isJoin:true,
        joinList: this.data.joinList
      })
    })
  },
  getWXACode(){
    app.getWXACode({
      path:'pages/activeDetail/activeDetail',
      scene:this.data.active._id
    }).then(res => {
      
    })
  },
  toShare(){
    wx.setStorageSync("active", this.data.active)
    wx.navigateTo({
      url: '/pages/share/share',
    })
  },
  aginAdd(){
   
    wx.setStorageSync('active',this.data.active)
    wx.navigateTo({
      url: '/pages/addActive/addActive',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.active.content,
      path: "/pages/activeDetail/activeDetail?activeId="+this.data.active._id,
      imageUrl: this.data.shareImg
    }
  }
})