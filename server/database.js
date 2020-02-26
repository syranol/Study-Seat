var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : process.env.aalkbn5j88gqld.cryupad9ltws.us-east-2.rds.amazonaws.com,
  user     : process.env.shon4081,
  password : process.env.!osucs467capstone,
  port     : process.env.3306
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

connection.end();