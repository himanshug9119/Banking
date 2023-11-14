const db = require("../db/db_config.js");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const times = 8;
const path = "C:/Users/Himanshu Gupta/Desktop/Projects/Bank/";
const JWT_SECRET = "hjdsfhdkjsfh8732fsjkghfjk";
const JWT_EXPIRES_IN = "1d"; // Use a valid time format here, e.g., "1d" for 1 day
const JWT_COOKIE_EXPIRES = 1;


exports.see = (req, res) => {
  const query = "show tables";
  db.query(query, (err, rows, fields) => {
    if (err) {
      console.log("error occured - not able to show all tables", err);
    }
    res.render("see", {
      table: null,
      tablename: rows.map((row) => row.Tables_in_bank),
      tablehead: null,
      tabledata: null,
    });
  });
};


exports.see.table = (req, res) => {
  console.log(req.body);
  const table = req.body.tableName;
  const query = "SELECT * FROM " + table;
  console.log(query);
  // variables to store table data and table names
  let head, row, tablenames;
  // query for table data
  db.query(query, (err, rows, fields) => {
    if (err) {
      console.log("Error occurred while fetching table data", err);
      return res.status(500).send("Error fetching table data");
    }
    row = rows;
    head = fields.map((column) => column.name);
  });
  // query for table names
  db.query("show tables", (err, rows, fields) => {
    if (err) {
      console.log("error occured - not able to show all tables", err);
      return res.status(500).send("Error fetching table names");
    }
    res.status(200).render("see", {
      table: table,
      tablename: rows.map((row) => row.Tables_in_bank),
      tablehead: head,
      tabledata: row,
    });
  });
};

exports.profiledata = async (req, res, next) => {
  try {
    const query = "SELECT * FROM user WHERE email_id = ?";
    const decoded = await promisify(jwt.verify)(
      req.cookies.userSave,
      JWT_SECRET
    );
    const email_id = decoded.id;
    console.log(email_id)
    db.query(query, [email_id], (err, rows, fields) => {
      if (err) {
        console.log("Error occurred while fetching user data", err);
        return res.status(500).send("Error fetching user data");
      }

      // Attach the fetched data to the req object
      if (rows.length === 0) {
        console.error("No user data found for email_id:", email_id);
        return res.status(404).send("User data not found");
      }
      req.profileData = rows[0];
      console.log(req.profileData);
      res.status(200).send(req.profileData);
      // console.log(req.profileData);
      // next(); // Call next() to proceed to the next middleware or route handler
    });
  } catch (err) {
    console.error("Error occurred in profiledata middleware", err);

    // Check if the error is due to JWT expiration
    if (error.name === "TokenExpiredError") {
      // Redirect the user to the login page
      return res.redirect("/login");
    }
    return res.status(500).send("Error in profiledata middleware");
  }
};


