const Books = require('../dao/books');
const Comments = require('../dao/comments');
const moment = require('moment');

module.exports = {
    /**
     * 获取所有书籍信息
     * @param req
     * @param res
     * @param next
     */
    getAllBooks: function (req, res, next) {
        Books.getBookInfo(true).then(resData => {
            res.json({
                result: 0,
                data: resData.map(item => {
                    return {
                        author: item.bkauthor || '',
                        category: item.bkclass || '',
                        cover_url: item.bkcover || '',
                        file_url: item.bkfile || '',
                        book_id: item.bkid || '',
                        book_name: item.bkname || '',
                        book_price: item.bkprice || 0,
                        book_publisher: item.bkpublisher || ''
                    }
                })
            })
        })
    },
    /**
     * 根据书籍id获取书籍
     */
    getBookById: function (req, res, next) {
        console.log("根据书籍id获取书籍");
        const bookid = req.query.bookid;
        if (!bookid) {
            res.json({
                result: -1,
                errMessage: "缺少请求参数字段bookid，请检查后重试",
            });
            return;
        }
        Books.getBookInfo(false, bookid).then(resData => {
            res.json({
                result: 0,
                data: resData.map(item => {
                    return {
                        author: item.bkauthor || '',
                        category: item.bkclass || '',
                        cover_url: item.bkcover || '',
                        file_url: item.bkfile || '',
                        book_id: item.bkid || '',
                        book_name: item.bkname || '',
                        book_price: item.bkprice || 0,
                        book_publisher: item.bkpublisher || ''
                    }
                }),
            });
        })
    },
    /**
     * 根据Skey获取书籍
     */
    queryBookBySkey: function (req, res, next) {
        console.log("根据Skey获取书籍");
        const bookid = req.query.bookid;
        const skey = req.query.skey;
        Books.queryBookBySkey(bookid, skey).then(resData1 => {
            Comments.queryComments(bookid).then(resData2 => {
                res.json({
                    result:0,
                    buyCount: resData1[0].buyCount,
                    commentList: resData2.map(item => {
                        return {
                            cmid: item.cmid || '',
                            uid: item.uid || '',
                            uname: item.uname || '',
                            ccontent: item.ccontent || '',
                            book_id: item.bkid || '',
                            book_name: item.bkname || '',
                            uavatar: item.uavatar || '',
                            ctime: item.ctime || ''
                        }
                    }),
                });
            });
        });
    }
};