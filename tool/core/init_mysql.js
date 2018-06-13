/**
 * 根据传入的数据库名 初始化数据库连接 返回connection对象
 */

var mysql = require('mysql');
var config=require('../config/sql.js');
var connection;
module.exports.createConnection=function (basename) {
      connection = mysql.createConnection({
        host     : config.host,
        user     : config.user,
        password : config.password,
        database : basename
    });
    return connection;
};

module.exports.connect=function () {
    connection.connect();
};

module.exports.connEnd=function () {
    connection.end();
};
