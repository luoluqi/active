//index.js
var date = require("../../util/date.js");
const app = getApp();
Page({
  data: {
    title: '生成分享图片',
    barBg: '#ffffff',
    color: '#000',

    painting: {},
    shareImage: '',
    isShow:false,

    top:0,

    bgList:[
      {
        big: "/welfare/img/b4.png",
        thum: "/welfare/img/t4.png",
        color: "#fff",
        bgColor: "#000",
        img: ""
      },

      {
        big: "/welfare/img/b2.png",
        thum: "/welfare/img/t2.png",
        color: "#fff",
        bgColor: "#e23d0e",
        img: ""
      },

      {
        big: "/welfare/img/b1.png",
        thum: "/welfare/img/t1.png",
        color: "#fff",
        bgColor: "#ffc300",
        img: ""
      },

      {
        big: "/welfare/img/b3.png",
        thum: "/welfare/img/t3.png",
        color: "#fff",
        bgColor: "#4f93ea",
        img: ""
      },

      

      {
        big: "/welfare/img/b5.png",
        thum: "/welfare/img/t5.png",
        color: "#fff",
        bgColor: "#07c160",
        img: ""
      }

     

    ],
   
    bgIndex:0
  },
  onLoad (options) {
    
    this.setConHeight();
    this.data.active = wx.getStorageSync("active");
    if (typeof  this.data.active.imgList == 'string'){
      this.data.imgList = this.data.active.imgList.split(',')
    }else{
      this.data.imgList = this.data.active.imgList
    }
   
    wx.showLoading({
      title: '加载中',
    })
    app.getWXACode({
      path: 'pages/activeDetail/activeDetail',
      scene: this.data.active._id
    }).then(res => {
      wx.hideLoading()
      console.log(res.result)
      this.data.codeImg = res.result
      this.share()
    }) 
  },

 

  //绘制分享图
  share:function(){

    var height = 1490;
    var width = 750;
   

    var param = {
      width: width,
      height: height,
      clear: true
    
    }

    this.data.top = 30;
    this.data.views = [];
    this.data.views.push({
      type: "rect",
      background: this.data.bgList[this.data.bgIndex].bgColor,
      top: 0,
      left: 0,
      width: width,
      height: height
    });
  
    this.data.top += 40;
    this.data.views.push({
      type: 'image',
      url: this.data.active.avatarUrl,

      top: this.data.top,//35
      left: 319,
      width: 112,
      height: 112,
      borderRadius: 56
    });

    this.data.top += 136;
    this.data.views.push({
      type: 'text',
      content: this.data.active.nickName,
      fontSize: 30,
      color: '#fff',
      textAlign: 'center',
      top: this.data.top,//150
      left: width / 2,
    });

    this.data.top += 45;
   
    this.data.views.push({
      type: 'text',
      content: this.data.active.content,
      fontSize: 35,
      color: '#fff',
      textAlign: 'left',
      top: this.data.top,//725
      left: 55,
      breakWord: true,
      MaxLineNumber: 2,
      width: 640,
      lineHeight: 50
    });

    this.data.top += 105;

    this.data.views.push({
      type: "rect",
      background: "#fff",
      top: this.data.top,
      left: 30,
      width: 690,
      height: height - this.data.top - 30
    });

    this.data.top += 25;

    this.data.views.push({
      type: 'image',
      url: this.data.imgList[0],
      top: this.data.top,//307
      left: 55,
      width: 640,
      height: 500
    });

    this.data.top += 524;

    this.data.views.push({
      type: 'text',
      content: this.data.active.date,
      fontSize: 30,
      textAlign: 'left',
      top: this.data.top,//150
      left: 55
    });

    this.data.top += 45;

    this.data.views.push({
      type: 'text',
      content: this.data.active.address,
      fontSize: 30,
      textAlign: 'left',
      breakWord: true,
      MaxLineNumber: 2,
      width: 640,
      lineHeight: 50,
      top: this.data.top,//150
      left: 55
    });

    this.data.top += 120;

    this.data.views.push({
      type: "rect",
      background: "#999",
      top: this.data.top,//895
      left: 30,
      width: 690,
      height: 1
    });

    this.data.top += 70;
    this.data.views.push({
      type: 'image',
      url: this.data.codeImg,
      top: this.data.top,//905
      left: 285,
      width: 180,
      height: 180
    });

    this.data.top += 260
    this.data.views.push({
      type: 'text',
      content: "长按识别小程序，参与活动",
      fontSize: 30,
      color: '#000',
      textAlign: 'center',
      top: this.data.top,//1095
      left: width / 2,
    });

    this.data.top += 70;
    this.data.views.push({
      type: "rect",
      background: "#999",
      top: this.data.top,//1145
      left: 30,
      width: 690,
      height: 1
    });

    this.data.top += 10;
    

    param.views = this.data.views;
    
    this.eventDraw(param)
  },

 
  change:function(e){
    
    var index = e.currentTarget.dataset.index;

    if (this.data.bgList[index].img) {
      

      this.setData({
        isShow: false,
        bgIndex: index,
        shareImage: this.data.bgList[index].img
      });
      wx.showLoading({
        title: '绘制分享图片'
      })
      setTimeout(() => {
        wx.hideLoading()
        this.setData({
          isShow: true
        });
      },200);
     
    }else{
      this.setData({
        bgIndex: index
      });

      this.share();
      
    }
  },


  
  eventDraw (param) {
    wx.showLoading({
      title: '绘制分享图片'
      
    })

    this.setData({
      painting: param,
      isShow:false
    })
  },
  eventSave () {
    wx.showLoading({
      title: '正在保存',
      mask: true
    })
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success (res) {
        wx.hideLoading();
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
  })
  },
  eventGetImage (event) {
    
    console.log(event)
   
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
      this.data.bgList[this.data.bgIndex].img = tempFilePath;


      setTimeout(() => {
        wx.hideLoading(),
          this.setData({

            isShow: true
          })
      }, 100);
    }

   
  },
  setConHeight:function(){
    
    var device = app.globalData.myDevice;
    var height = device.screenHeight;
    var width = device.screenWidth;
    var ratio = 750 / width;
    
    var a = height - 68 - 256 / ratio;
    this.setData({
      conHeight: height - 68 - 256 / ratio - 20
    });
  }
})
