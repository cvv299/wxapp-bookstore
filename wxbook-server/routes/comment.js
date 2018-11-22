const express   = require('express');
const Book      = require('../controllers/books');
const User      = require('../controllers/users');
const Comments      = require('../controllers/comments');
const router    = express.Router();

router.post('/write',function (req,res,next) {
    Comments.addComment(req,res,next);
});

module.exports = router;