/**
 * Created by 15879 on 2017/12/5.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
/*  将数据存到数据库  */

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
});
//var  sql = 'SELECT * FROM rs';
var  addSql = "INSERT INTO rs(province,city,title,lng,lat,address,phoneNumber,tags,keyword) VALUES ?";
connection.connect();


router.post('/', function(req, res, next) {

    var addSqlParams=[];

      var data =  req.body;

        for (var index in data) {
            var arr = data[index].split(', ');
            var temp=[];
           for(var i=0;i<arr.length;i++){
             temp[i]=arr[i];
            }
            addSqlParams.push(temp);
        }

            connection.query(addSql,[addSqlParams], function (err, result) {
                if (err) {
                    console.log('[INSERT ERROR] - ', err.message);
                    return;
                }
            });

    res.writeHead(200,{'content-Type':'text/plain'});
    res.end("接受成功");
 });


module.exports = router;