// miniprogram/addActive/add/add.js
const app = getApp()
const activeApi = require('../../api/activeApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:true,

    content: '',
    imgList: [],
    date:'',
    time: '',
    address: ''
  },
  pageData:{
    latitude:'',
    longitude:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var active = wx.getStorageSync("active")
    if(active){
      console.log(active)
      this.setData({
        content : active.content,
        imgList : active.imgList,
        date : active.date.split(" ")[0],
        time : active.date.split(" ")[1],
        address : active.address
      })
     
      this.pageData.latitude = active.location.coordinates[1];
      this.pageData.longitude = active.location.coordinates[0];
    }

    wx.setStorageSync("active",null)

    // this.isShow()
  },
  isShow() {
    activeApi.getIsShow().then(res => {

      if (res.length > 0) {
        this.setData({
          isShow: true
        })
      } else {
        this.setData({
          isShow: false
        })
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
  chooseLocation(){
    var opt = {
     
      success:(res) => {
        console.log(res)
        var name = res.name;
        this.pageData.address = res.address;
        this.pageData.latitude = res.latitude;
        this.pageData.longitude = res.longitude;
        this.setData({
          address:name
        })
      },
      fail:(res) => {
        wx.openSetting({
          success(res) {
            console.log(res.authSetting)
          }
        })
      },
      complete: (res) => {

      }
    }
    if(this.pageData.latitude){
      opt. latitude = this.pageData.latitude
    }
    if(this.pageData.longitude){
      opt. longitude = this.pageData.longitude
    }
    wx.chooseLocation(opt)
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  contentInput: function(e) {
    var val = e.detail.value;

    this.setData({
      content: val
    });
  },
  chooseImage:function(){
    wx.chooseImage({
      count: 9 - this.data.imgList.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        
        const tempFilePaths = this.data.imgList.concat(res.tempFilePaths)
        this.setData({
          imgList: tempFilePaths
        })
      }
    })
  },

  delImg(e){
    
    var index = e.currentTarget.dataset.index
    this.data.imgList.splice(index,1)
    this.setData({
      imgList: this.data.imgList
    })
  },

  addActive(){
  
    if(!this.data.content){
      wx.showToast({
        title:'请填写活动介绍',
        icon:'none'
      })
      return;
    }
    if(!this.data.date){
      wx.showToast({
        title:'请选择日期',
        icon:'none'
      })
      return;
    }
    if(!this.data.time){
      wx.showToast({
        title:'请选择时间',
        icon:'none'
      })
      return;
    }
    if(!this.data.address){
      wx.showToast({
        title:'请选择地点',
        icon:'none'
      })
      return;
    }
    wx.showLoading({
      mask:true
    })
    this.uploadImgList().then(res => {
      
     
      activeApi.addActive({
  
          openid : app.globalData.openid,
          avatarUrl : app.globalData.userInfo.avatarUrl,
          nickName : app.globalData.userInfo.nickName,
          content:  this.data.content,
         fileList: res.map((f) => f.fileID),
          imgList: res.map((f) => f.tempFileURL),
          date:  this.data.date + ' ' + this.data.time,
          address :  this.data.address,
          longitude: this.pageData.longitude,
          latitude: this.pageData.latitude
        
      }).then(data => {
          wx.hideLoading()
          wx.showToast({
            title: '添加成功',
          })
          wx.redirectTo({
            url: '/pages/activeDetail/activeDetail?activeId=' + data
          })
      })
    })
    
   
  },

  uploadImgList(){
    return new Promise((resolve,reject) => {
      if(this.data.imgList.length == 0){
        resolve([])
        return
      }
      var proArr = []
      for(let img of this.data.imgList){
        var pro = new Promise((rs,rj) => {
          const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
          if (objExp.test(img)) {
            rs("")
          }else{
            var suffix = img.substring(img.lastIndexOf('.'));
            var path = new Date().getTime() + '' + Math.random() + suffix
            wx.cloud.uploadFile({
              cloudPath: path,
              filePath: img, // 文件路径
            }).then(res => {
              rs(res.fileID)
            }).catch(error => {
              // handle error
            })
          }
         
        })
        proArr.push(pro)
      }
      Promise.all(proArr).then(res => {
        wx.cloud.getTempFileURL({
          fileList: res
        }).then(res => {
          
          var fileList = res.fileList;
          for(var i = 0;i<fileList.length;i++){
            var file = fileList[i];
            if(!file.fileID){
              file.tempFileURL = this.data.imgList[i]
            }
          }
          resolve(fileList)
        }).catch(error => {
          
          // handle error
        })
       
      })
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

  }
})