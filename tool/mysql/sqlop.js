/**
 *
 * @param sql 需要传入的sql语句  类似'SELECT * FROM websites' 字符串
 * @param connection 一个mysql的mysql连接对象
 */
module.exports.query=function (sql,connection,callback) {
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
            callback(err,result)
        }

        console.log('--------------------------SELECT----------------------------');
        callback(err,result);
        console.log('------------------------------------------------------------\n\n');
        // connection.end();
    });
}

/**
 * 批量插入
 * @param addSql 字符串  'INSERT INTO doubanmovie_info(_id,_title,_casts,_cover,_director,_rate,_url,tags) VALUES ?'
 * @param addSqlParams   array  二维数组  每条数据为一个字数组
 * @param connection
 */
module.exports.insert=function (addSql,addSqlParams,connection,callback) {
    connection.query(addSql,[addSqlParams], function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
        }
        console.log('--------------------------INSERT----------------------------');
        console.log('INSERT ID:',result.insertId);
        console.log('-----------------------------------------------------------------\n\n');

    });
}
/**
 *
 * @param modSql var modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
 * @param modSqlParams  var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com',6];
 * @param callback
 */
module.exports.updata=function (modSql,modSqlParams,callback) {
    connection.query(modSql,modSqlParams,function (err, result) {
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            return;
        }
        console.log('--------------------------UPDATE----------------------------');
        console.log('UPDATE affectedRows',result.affectedRows);
        console.log('-----------------------------------------------------------------\n\n');
    });

}