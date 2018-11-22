// pages/detail/detail.js
const api = require('../../config/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookInfo:{},
    downloading:false,
    downloadPercent:0,
    commentLoading:false,
    commentList:{},
    bookIsBuy:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _bookInfo = {};
    let that = this;
    for(let key in options){
      _bookInfo[key] = decodeURIComponent(options[key]);
    }
    that.setData({
      bookInfo: _bookInfo,
    });
    that.loadComment();

  },
  goComment:function(ev){
    let info = ev.currentTarget.dataset;
    let navigateUrl = '/pages/comment/comment?';
    for(let key in info){
      navigateUrl+= key +"="+info[key]+"&";
    }
    navigateUrl = navigateUrl.substring(0, navigateUrl.length-1);
    console.log(navigateUrl);
    wx.navigateTo({
      url: navigateUrl,
    })
  },
  loadComment:function(){
    let that = this;
    wx.request({
      url: api.queryBookUrl,
      data:{
        skey:wx.getStorageSync('loginFlag'),
        bookid: that.data.bookInfo.id,
      },
      success:res=>{
        if(res.data.result===0){
          that.setData({
            bookIsBuy:res.data.buyCount,
            commentList: res.data.commentList
          });
        }else{
          console.log(res.data.result);
        }
       
      },
      fail:err=>{
        console.log(err);
      }
    })
  },
  readBook:function(ev){
    let that = this;
    let fileUrl = that.data.bookInfo.file;
    let key = 'book_' + that.data.bookInfo.id;
    // 书籍是否已下载过
    let downloadPath = app.getDownloadPath(key);
    if (downloadPath) {
      app.openBook(downloadPath);
      return;
    }

    const downloadTask = wx.downloadFile({
      url: fileUrl,
      success: function (res) {
        let filePath = res.tempFilePath
        that.setData({
          downloading: false
        });

        // 调用 wx.saveFile 将下载的文件保存在本地
        app.saveDownloadPath(key, filePath)
          .then(function (saveFilePath) {
            app.openBook(saveFilePath);
          })
          .catch(function () {
            app.showInfo('文件保存失败');
          });

      },
      fail: function (error) {
        that.showInfo('文档下载失败');
        console.log(error);
      }
    });

    downloadTask.onProgressUpdate(function (res) {
      that.setData({
        downloading: true,
        downloadPercent: res.progress
      });
    });
  },
  confirmBuyBook: function (ev) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定用1积分兑换此书吗？',
      showCancel: true,
      cancelText: '打扰了',
      cancelColor: '#8a8a8a',
      confirmText: '确定',
      confirmColor: '#1AAD19',
      success: res=>{
        if(res.confirm){
          that.buyBook();
        }
      }
    });
  },
  buyBook:function(){
    let that = this;
    let bookId = that.data.bookInfo.id;
    let requestData = {
      bookid: bookId,
      skey: app.getLoginFlag()
    };
    wx.request({
      url: api.buyBookUrl,
      method:'POST',
      data:requestData,
      success:res=>{
        console.log(res);
        if(res.data.result===1){
          wx.showModal({
            title: '提示',
            content: res.data.message,
          });
          that.loadComment();
        }
      },
      fail:err=>{
        console.log(err);
      }
    })
  }
})