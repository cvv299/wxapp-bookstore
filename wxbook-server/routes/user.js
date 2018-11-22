const express   = require('express');
const User      = require('../controllers/users');
const router    = express.Router();

/**
 * @desc    查询当前用户已购书籍
 * @method  {*请求方法} GET
 */
router.get('/getBoughtBooks', function (req, res, next) {
    let {skey} = req.query;
    User.getBoughtBooks(skey).then(resData=>{
        console.log(resData);
        res.send(resData);
    });
});

module.exports = router;