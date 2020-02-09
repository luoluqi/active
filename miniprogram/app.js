//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        env: 'qqqq-bqgzl',
        traceUser: true,
      })
    }

    this.globalData.myDevice = wx.getSystemInfoSync();
   this.getOpenid()
   this.getUserInfo()
  },
  getOpenid(){
    return new Promise((resolve,reject) => {
        if(this.globalData.openid){
          resolve()
          return
        }
        wx.cloud.callFunction({
          name: 'login'
        }).then(res => {
          this.globalData.openid = res.result.openid
          resolve()
        })
    })
  },
  getUserInfo(){
     // 获取用户信息
    return new Promise((resovle,reject) => {
      if(this.globalData.userInfo){
        resovle()
        return
      }
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                console.log(res)
                this.globalData.userInfo = res.userInfo
                resovle()
              }
            })
          }else{
            resovle()
          }
        }
      })
    })
  },
  //创建名片分享图
  createShareImg: function (active) {
    return new Promise((resolve,reject) => {
      const ctx = wx.createCanvasContext('shareCan')
      var imgList = active.imgList
      if (typeof active.imgList == 'string'){
        imgList = active.imgList.split(",")
      }
     
      wx.getImageInfo({
        src: imgList[0],
        complete: res => {
          
          var width = res.width;
          var height = res.height;
          var cover_img = res.path;
          var scale = 5 / 4;
          var sWidth = 0;
          var sHeight = 0;
          var sx = 0;
          var sy = 0;
          if(width <= height){
            sWidth = width;
            sHeight = width / scale;
            sy = (height - sHeight) / 2;

          }else{
            sHeight = height;
            sWidth = height * scale
            sx = (width - sWidth) / 2
          }
          // ctx.drawImage(cover_img, 0, 0, 500, 400);
          ctx.drawImage(cover_img, sx, sy, sWidth, sHeight, 0, 0, 500, 400)

          ctx.draw(true, () => {
            wx.canvasToTempFilePath({
              canvasId: 'shareCan',
              quality: 1,
              fileType: "jpg",
              success: (res) => {

                resolve(res.tempFilePath);

              }
            })

          })


        }
      })
    })
  },
  getWXACode(param){
    return new Promise((resolve,reject) => {
      wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: "getWXACode",
          path: param.path,
          scene: param.scene
        }
      }).then(res => {
        resolve(res)
      })
    })
  },
  globalData:{}
})
