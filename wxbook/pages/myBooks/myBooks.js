// pages/myBooks/myBooks.js
const api = require('../../config/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookList: {},
    showDownloading: false,
    downloadPercent: 0,
    showLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.getMybooks();
  },
  getMybooks :function(){
    let that = this;
    wx.request({
      url: api.getBoughtBooksUrl,
      data: {
        skey: app.getLoginFlag(),
      },
      success: res => {
        console.log(res.data);
        that.setData({
          bookList: res.data,
        });
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  readBook:function(ev){
    let that = this;
    let data = ev.currentTarget.dataset;
    let key = 'book_'+data.id;
    let fileUrl = data.file;

    //如果书籍已下载，则直接打开
    let downloadPath = app.getDownloadPath(key);
    if(downloadPath){
      app.openBook(downloadPath);
      return;
    }

    //如果没有下载，则开始下载
    const downloadTask = wx.downloadFile({
      url: fileUrl,
      success: function(res) {
        let filePath = res.tempFilePath;
        that.setData({
          showDownloading: false
        });

        //下载后保存书籍路径
        app.saveDownloadPath(key,filePath).then(saveFilePath=>{
          app.openBook(saveFilePath);
        }).catch(rejectData=>{
          app.showInfo(rejectData);
        })
      },
      fail: function(res) {
        app.showInfo('文档下载失败');
        console.log(error);
      }
    });

    // 监听当前文件下载进度
    downloadTask.onProgressUpdate(function (res) {

      console.log('下载进度返回的res:', res);

      let progress = res.progress;

      that.setData({
        showDownloading: true,
        downloadPercent: progress
      });

    });
  },
})