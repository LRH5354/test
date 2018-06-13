var init=require('../core/init_mysql');
var op=require('./sqlop')
var connection=init.createConnection('movie_info');
connection.connect();
var sql='select count(id) as counts from doubanmovie_info where tags=\'动漫\''

op.query(sql,connection,function (err,result) {
    if(err){
        console.log(err.message);
        return;
    }
    console.log(result)
});