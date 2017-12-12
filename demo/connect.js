const mysql = require('mysql');
const config = require('./connectConfig.json');

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.error(`error: ${err.message}`);
    return;
  }
  console.log('Connected to the MySQL server.');

  const sql = 'SELECT * FROM login';
  connection.query(sql, (error, results) => {
    if (err) {
      console.error(`error: ${error.message}`);
      return;
    }
    console.log(results);
  });

  connection.end((error) => {
    if (error) {
      console.error(`error: ${error.message}`);
    }
    console.log('Close the database connection');
  });
});

