const Users = require('../dao/users');

module.exports = {
    /**
     * 保存用户信息
     */
    saveUserInfo: function(obj) {
        const userInfo = obj.userInfo || {},
            session_key = obj.session_key || '',
            skey = obj.skey || '';
        // 用户信息存表
        console.log(obj);
        return Users.saveUserInfo(userInfo, session_key, skey).then(function(resData) {
            console.log(resData);
            return resData
        })
    },
    /**
     * 获得已购买书籍
     */
    getBoughtBooks:function (skey='') {
        return Users.getBoughtBooks(skey).then(resData=>{
            console.log(resData);
            return resData;
        });
    }

};