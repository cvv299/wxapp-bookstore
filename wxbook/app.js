//app.js
const api = require('./config/config.js');
App({
  onLaunch: function () {
    let that = this;
    that.checkLoginStatus();
    if(!that.globalData.userInfo){
      that.doLogin();
      that.setUserInfo();
    }
  },
  setUserInfo:function(){
    let that = this;
    wx.getUserInfo({
      success: res=>{
        that.globalData.userInfo = res.userInfo
        console.log("setUserInfo", that.globalData.userInfo,">>>>>");
      }
    })
  },
  // 检查本地 storage 中是否有登录态标识
  checkLoginStatus: function () {
    let that = this;
    let loginFlag = wx.getStorageSync('loginFlag');
    if(loginFlag){
      wx.checkSession({
        success: function(res) {
          console.log("checkSession success",res);
        },
        fail: function(res) {
          console.log("checkSession fail",res);
        },
        complete: function(res) {},
      })
    }else{
      console.log("run doLogin");
      that.doLogin();
    }
  },
  // 登录动作
  doLogin: function (callback = () => {}) {
    let that = this;
    wx.login({
      success: function (loginRes) {
        console.log("loginRes",loginRes);
        if (loginRes.code) {
          /* 
           * @desc: 获取用户信息 期望数据如下 
           *
           * @param: userInfo       [Object]
           * @param: rawData        [String]
           * @param: signature      [String]
           * @param: encryptedData  [String]
           * @param: iv             [String]
           **/
          // 获取用户信息
          console.log("start to getSetting");
          wx.getSetting({
            success: res => {
              console.log("getSetting success",res);
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  withCredentials: true, // 非必填, 默认为true
                  success: function (infoRes) {
                    console.log(infoRes, '>>>')
                    // 请求服务端的登录接口
                    wx.request({
                      url: api.loginUrl,

                      data: {
                        code: loginRes.code,                    // 临时登录凭证
                        rawData: infoRes.rawData,               // 用户非敏感信息
                        signature: infoRes.signature,           // 签名
                        encryptedData: infoRes.encryptedData,   // 用户敏感信息
                        iv: infoRes.iv                          // 解密算法的向量
                      },

                      success: function (res) {
                        console.log('login success');
                        res = res.data;

                        if (res.result == 0) {
                          that.globalData.userInfo = res.userInfo;
                          wx.setStorageSync('userInfo', JSON.stringify(res.userInfo));
                          wx.setStorageSync('loginFlag', res.skey);
                          callback();
                        } else {
                          that.showInfo(res.errmsg);
                        }
                      },

                      fail: function (error) {
                        // 调用服务端登录接口失败
                        that.showInfo('调用接口失败');
                        console.log(error);
                      }
                    });
                  },
                  fail: function (error) {
                    // 获取 userInfo 失败，去检查是否未开启权限
                    wx.hideLoading();
                    that.checkUserInfoPermission();
                  }
                })
              }else{
                console.log("未授权");
              }
            },
            fail: err=>{
              console.log(err);
            }
          })
        } else {
          // 获取 code 失败
          that.showInfo('登录失败');
          console.log('调用wx.login获取code失败');
        }
      },

      fail: function (error) {
        // 调用 wx.login 接口失败
        that.showInfo('接口调用失败');
        console.log(error);
      }
    });
  },
  // 检查用户信息授权设置
  checkUserInfoPermission: function (callback = () => { }) {
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.openSetting({
            success: function (authSetting) {
              console.log(authSetting)
            }
          });
        }
      },
      fail: function (error) {
        console.log(error);
      }
    });
  },
  //获取用户登录标识  供全局调用
  getLoginFlag: function () {
    return wx.getStorageSync('loginFlag');
  },
  // 封装 wx.showToast 方法
  showInfo: function (info = 'error', icon = 'none') {
    wx.showToast({
      title: info,
      icon: icon,
      duration: 1500,
      mask: true
    });
  },
  // 获取书籍已下载路径
  getDownloadPath: function (key) {
    return wx.getStorageSync(key);
  },
  // 调用 wx.saveFile 将下载的文件保存在本地
  saveDownloadPath: function (key,filePath) {
    return new Promise((resolve,reject)=>{
      wx.saveFile({
        tempFilePath: filePath,
        success:res=>{
          //在Storage中标记，下次不再下载
            let savedFiledPath = res.savedFilePath;
            wx.setStorageSync(key, savedFiledPath);
            resolve(savedFiledPath);
        },
        fail:err=>{
          console.log(err);
          reject('文件保存失败');
        }
      });
    })
  },
  //打开书籍
openBook :function (filePath){
  console.log(filePath);
  wx.openDocument({
    filePath: filePath,
    fileType: 'txt',
    success: res=>{
      console.log('打开文档成功');
    },
    fail: err=>{
      console.log(err); 
    }
  })
},

  globalData: {
    userInfo: null
  }
})