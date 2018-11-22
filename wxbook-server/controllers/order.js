const User = require('../dao/users');
const Order = require('../dao/order');
const  Book = require('../dao/books');

module.exports = {
    buyBook: function (req, res, next) {
        let uid, balance, price;
        const {
            bookid,
            skey
        } = req.body;
        // 获取当前书籍的积分价值
        Book.getPriceById(bookid).then(resData=>{
            if(resData&&resData[0]&&resData[0].bkprice){
                price = Number(resData[0].bkprice);
                return User.getUserBalance(skey);
            }else{
                res.json({
                    result:-3,
                    message:'书籍信息错误',
                });
            }
        }).then(resData =>{

            let {
                ubalance,
                uid
            } = resData[0];
            ubalance = ubalance - price;
            Order.buyBook(uid, price, bookid);
            User.reduceBalance(ubalance, uid);
        }).then(()=>{
            res.json({
                result:1,
                message:'购买成功',
            });
        });
    }
};