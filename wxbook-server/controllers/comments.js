const Comments = require('../dao/comments');

module.exports = {
    addComment:function (req,res,next) {
        const {
            skey,
            bookid,
            comment
        } = req.body;
        Comments.addComment(skey,bookid,comment).then(resData=>{
            if(resData){
                res.json({
                    result:1,
                    message:'评论成功',
                });
            }else{
                res.json({
                    result:-1,
                    message:'评论失败',
                });
            }
        })
    }
};