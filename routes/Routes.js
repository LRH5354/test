/**
 *作者  15879 -  LRH
 *创建时间 2018  2018/5/13  10:13
 **/
var express = require('express');
var router = express.Router();
var querydb_cb=require('./cb/querydb')

router.get('/querydb', function(req, res, next) {
     querydb_cb(req,res);
})
module.exports = router;