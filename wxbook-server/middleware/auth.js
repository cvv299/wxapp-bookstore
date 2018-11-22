const http = require('axios');
const crypto = require('crypto');
const { appConfig: config } = require('../conf/app');
const { decryptByAES, encryptSha1 } = require('../util/util');
const { saveUserInfo } = require('../controllers/users');
/**
 * 登录校验中间件
 */
function authorizeMiddleware(req, res, next) {
    console.log("run authorizeMiddleware");
    return authMiddleware(req).then(function(result) {
        console.log(result);
        // 将结果存入响应信息的'auth_data'字段
        res['auth_data'] = result;
        return next();
    })
}

function authMiddleware (req) {
    const {
        appid,
        secret
    } = config;
    console.log(config,"config");
    const {
        code,
        encryptedData,
        iv
    } = req.query;


    // 检查参数完整性
    if ([code, encryptedData, iv].some(item => !item)) {
        return {
            result: -1,
            errmsg: '缺少参数字段，请检查后重试'
        }
    }
    // console.log(req.query.rawData);
    // return saveUserInfo({
    //     userInfo: req.query.rawData,
    //     session_key:"yes",
    //     skey:"yes"
    // });

    // 获取 session_key和 openid
    return getSessionKey(code, appid, secret)
        .then(resData => {
            // 选择加密算法生成自己的登录态标识
            console.log(123);
            const { session_key } = resData;
            const skey = encryptSha1(session_key);

            let decryptedData = JSON.parse(decryptByAES(encryptedData, session_key, iv));
            console.log('-------------decryptedData---------------');
            console.log(decryptedData);
            console.log('-------------decryptedData---------------');

            // 存入用户数据表中
            return saveUserInfo({
                userInfo: decryptedData,
                session_key,
                skey
            })
        })
        .catch(err => {
            return {
                result: -3,
                errmsg: JSON.stringify(err)
            }
        })
}

/**
 * 获取当前用户session_key
 * @param {*用户临时登录凭证} code 
 * @param {*小程序appid} appid 
 * @param {*小程序密钥} appSecret 
 */
function getSessionKey (code, appid, appSecret) {
    
    const opt = {
        method: 'GET',
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        params: {
            appid: appid.trim(),
            secret: appSecret.trim(),
            js_code: code,
            grant_type: 'authorization_code'
        }
    };
    console.log("auth/getSessionKey/opt", opt);
    return http(opt).then(function (response) {
        const data = response.data;
        console.log(data);
        if (!data.openid || !data.session_key || data.errcode) {
            return {
                result: -2,
                errmsg: data.errmsg || '返回数据字段不完整'
            }
        } else {
            return data
        }
        
    });
}
module.exports = {
    authorizeMiddleware
}