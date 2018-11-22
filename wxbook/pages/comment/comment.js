// pages/comment/comment.js
const api = require('../../config/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookInfo:{},
    comment:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
      this.setData({
        bookInfo:options,
      });
  },
  /**
   * 提交评论
   */
  submitComment:function(ev){
    let that = this;
    if(this.checkString()){
      let dataList={
        skey:wx.getStorageSync('loginFlag'),
        bookid:that.data.bookInfo.id,
        comment:that.data.comment
      };
      wx.request({
        url: api.commentUrl,
        method:'post',
        data:dataList,
        success:res=>{
          if(res.data.result===1){
            that.showInfo('评论成功', 'success', function () {
              wx.setStorageSync('isFromBack', '1');
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                });
              }, 1500);
            });
          }else{
            console.log(res.data.message);
          }
        },
        fail:err=>{
          console.log(err);
        }
      })
    }
  },
  /**
    *  封装 wx.showToast
    */
  showInfo: function (info, icon = 'none', callback = () => { }) {
    wx.showToast({
      title: info,
      icon: icon,
      duration: 1500,
      mask: true,
      success: callback
    });
  },
  /**
    * 用户输入评论
    */
  inputComment: function (ev) {
    let that = this;
    that.setData({
      comment: ev.detail.value
    });
  },
  /**
   * 检查字符串
   */
  checkString: function (){
    let that = this;
    let comment = that.data.comment;
    let status = false;
    let errMessage = '';
    if (that.checkEmpty(comment)){
      status=true;
      errMessage='请输入评论信息';
    }
    if (that.checkIllegal(comment)) {
      status = true;
      errMessage = '评论信息有非法字符';
    }
    if (comment.length>120) {
      status = true;
      errMessage = '内容过长';
    }
    if (status){
      wx.showModal({
        title: '警告',
        content: errMessage,
      });
      return false;
    }else{
      return true;
    }
  },
  /**
   * 检查输入是否为空
   */
  checkEmpty: function (input) {
    return input === '';
  },

  /**
   *  检查用户是否输入了非法字符
   */
  checkIllegal: function (input) {
    let patern = /[`#^<>:"?{}\/;'[\]]/im;
    let _result = patern.test(input);
    return _result;
  },
})