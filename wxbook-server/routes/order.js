const express   = require('express');
const router    = express.Router();
const order = require('../controllers/order');

router.post('/buy',function (req,res,next) {
    order.buyBook(req,res,next);
});

module.exports = router;