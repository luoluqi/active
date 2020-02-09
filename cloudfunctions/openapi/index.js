// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'sendTemplateMessage': {
      return sendTemplateMessage(event)
    }
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'getOpenData': {
      return getOpenData(event)
    }
    default: {
      return
    }
  }
}

async function sendTemplateMessage(event) {
  const { OPENID } = cloud.getWXContext()

  // 接下来将新增模板、发送模板消息、然后删除模板
  // 注意：新增模板然后再删除并不是建议的做法，此处只是为了演示，模板 ID 应在添加后保存起来后续使用
  const addResult = await cloud.openapi.templateMessage.addTemplate({
    id: 'AT0002',
    keywordIdList: [3, 4, 5]
  })

  const templateId = addResult.templateId
 
  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    templateId:'RhNeqU3gRjI7gN2hTSl-5SDSORnK11PJN0iD1PaRGCM',
    formId: event.formId,
    page: 'pages/openapi/openapi',
    data: {
      thing4: {
        value: '爬鼓山',
      },
      thing2: {
        value: '爬鼓山看风景',
      },
      date3: {
        value: '2019-01-05',
      },
      date5: {
        value: '2019-01-05',
      },
    }
  })

  await cloud.openapi.templateMessage.deleteTemplate({
    templateId,
  })

  return sendResult
}

async function getWXACode(event) {
  //先查查库里面有没有二维码的图片
  var qrcodeRes = await db.collection('qrcode').where({
    scene: event.scene
  }).get()
  console.log(qrcodeRes)
  var qrcode = qrcodeRes.data[0]
  if (qrcode){
    return qrcode.url
  }
 

  // 此处将获取永久有效的小程序码，并将其保存在云文件存储中，最后返回云文件 ID 给前端使用
  console.log("=========================")
  console.log({
    page: event.path,
    scene: event.scene
  })
  const wxacodeResult = await cloud.openapi.wxacode.getUnlimited({
    page: event.path,
    scene: event.scene
  })

  const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'

  var p = new Date().getTime() + "" + Math.random();
  const uploadResult = await cloud.uploadFile({
    // 云文件路径，此处为演示采用一个固定名称
    
    cloudPath: `${p}.${fileExtension}`,
    // 要上传的文件内容可直接传入图片 Buffer
    fileContent: wxacodeResult.buffer,
  })

  if (!uploadResult.fileID) {
    throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  }

 
  const result = await cloud.getTempFileURL({
    fileList: [uploadResult.fileID],
  })
  // 将二维码的图保存起来
  await db.collection('qrcode').add({
    data: {
      url: result.fileList[0].tempFileURL,
      scene: event.scene,
      fielID: uploadResult.fileID,
      createDate: new Date()
    }
  })

  return result.fileList[0].tempFileURL

  
}

async function getOpenData(event) {
  // 需 wx-server-sdk >= 0.5.0
  return cloud.getOpenData({
    list: event.openData.list,
  })
}
