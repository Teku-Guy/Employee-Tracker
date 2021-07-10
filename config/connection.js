// Import and require mysql2
const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' })

console.log(process.env.DB_PASS)
// Connect to database
const connection = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

connection.query(
    'SELECT * FROM `employee`',
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
    }
  );  


module.exports = connection;