  var init = require('../../tool/core/init_mysql');

  /* 创建连接 */
  var connection = init.createConnection('movie_info');
  connection.connect();
  //where city=\'广州\'
  var cb = function(req, res) {
      if (!!req.query.ne_lat) {
       var query='select * from gis_job where lng<'+req.query.ne_lng+'and lng>'
                +req.query.sw_lng+'and lat>'+req.query.sw_lat+'and lat<'+req.query.ne_lat;
        connection.query(query, function(err, rows) {
              if (err) {
                  console.log(err.message);
              }
              res.json(rows)
          });
      } else {
          connection.query('select * from gis_job ', function(err, rows) {
              if (err) {
                  console.log(err.message);
              }
              res.json(rows)
          });
      }
  }

  module.exports = cb;