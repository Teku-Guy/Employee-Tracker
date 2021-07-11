// Import and require mysql2
const mysql = require('mysql2');
require('dotenv').config()

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASS,
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

module.exports = connection;