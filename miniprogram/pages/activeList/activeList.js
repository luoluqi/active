const app = getApp()
const activeApi = require('../../api/activeApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeList : [],
    isMore:true
  },
  pageData: {
    pageNum : 0,
    pageSize : 8
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageData.type = options.type
    switch(options.type){
      case 'myActive':
      this.getMyActive()
      break
      case 'myJoinActive':
        this.getMyJoinActive()
        break
    }
  },

  getMyActive(){
    console.log('getMyActive...')
    if(!this.data.isMore){
      return
    }
    this.pageData.pageNum ++
    activeApi.getMyActive({
      pageNum : this.pageData.pageNum,
      pageSize : this.pageData.pageSize
    }).then(res => {
      console.log(res)
      if(res.length < this.pageData.pageSize){
        this.setData({
          isMore:false
        })
      }
      for(var item of res){
        if (typeof item.imgList == 'string'){
          item.imgList = item.imgList.split(',')
        }
        
      }
      var activeList = this.data.activeList.concat(res)
      this.setData({
        activeList:activeList
      })
    })
  },

  getMyJoinActive(){
    console.log('getMyJoinActive...')
    if(!this.data.isMore){
      return
    }
    this.pageData.pageNum ++
    console.log( this.pageData.pageNum)
    activeApi.getMyJoinActive({
      pageNum : this.pageData.pageNum,
      pageSize : this.pageData.pageSize
    }).then(res => {
      console.log(res)
      if(res.length < this.pageData.pageSize){
        this.setData({
          isMore:false
        })
      }
      var activeList = res.map((obj) => {
        return obj.activeList[0]
      })
      for(var item of activeList){
        if (typeof item.imgList == 'string'){
          item.imgList = item.imgList.split(',')
        }
      }
      var list = this.data.activeList.concat(activeList)
      this.setData({
        activeList:list
      })
    })
  },

  previewImage(e){
    var img = e.currentTarget.dataset.img
    var list = e.currentTarget.dataset.list
    
    wx.previewImage({
      urls: list,
      current: img
    })
  },

  toDetail(e){
    var active = e.currentTarget.dataset.active
   
    wx.navigateTo({
      url: '/pages/activeDetail/activeDetail?activeId='+active._id,
    })
  },

  previewImage(e) {
    var url = e.currentTarget.dataset.url
    var list = e.currentTarget.dataset.list
    wx.previewImage({
      urls: list,
      current: url
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
    // wx.stopPullDownRefresh( )
    // this.pageData.pageNum = 0
    // this.setData({
    //   isMore:true
    // })
    // switch(this.pageData.type){
    //   case 'myActive':
    //   this.getMyActive()
    //   break
    //   case 'myJoinActive':
    //     this.getMyJoinActive()
    //     break
    // }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    switch(this.pageData.type){
      case 'myActive':
      this.getMyActive()
      break
      case 'myJoinActive':
        this.getMyJoinActive()
        break
    }
 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})