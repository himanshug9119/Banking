const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Guptag489@",
    database:"bank"
});

db.connect((err) => {
    if (err) {
      console.error('MySQL connection failed:', err);
      throw err;
    }
    console.log('Connected to MySQL database');
});

module.exports = db;