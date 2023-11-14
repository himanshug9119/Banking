
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/db_config");
// const path = __dirname;
// console.log(path);
const path = "C:\Users\Himanshu Gupta\Desktop\Projects\Bank";
const times = 8;
const JWT_SECRET = "hjdsfhdkjsfh8732fsjkghfjk";
const JWT_EXPIRES_IN = "10m"; // Use a valid time format here, e.g., "1d" for 1 day
const JWT_COOKIE_EXPIRES = 1;

exports.login = async (req, res) => {
    try {
        const {email_id, password} = req.body;
        const usertype = req.body.usertype;
        const query = `SELECT * FROM password_manager WHERE email_id = '${[email_id]}'`;
        db.query(query, async (err, results) => {
            if (err) {
                console.log("Error occurred - error - ", err);
            }
            console.log(results);
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                console.log("Email or Password is incorrect");
                res.redirect("/login");
            } else {
                // const id = results[0].id;
                const token = jwt.sign({ id:email_id }, JWT_SECRET, {
                    expiresIn: JWT_EXPIRES_IN,
                });

                console.log("the token is " + token);

                const cookieOptions = {
                    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                };
                res.cookie("userSave", token, cookieOptions);
                userrole = results[0].role;
                // Render the profile.ejs page with the user's email_id and usertype
                if(userrole === usertype){
                    if (userrole === "admin") {
                        // res.redirect("adminprofile");
                        res.render("adminprofile", { email_id: email_id, usertype: usertype });
                    } else if (userrole === "user") {
                        res.render("userprofile", { email_id: email_id, usertype: usertype });
                    }
                }else{
                    return res.sendFile(path + "public/login.html", {
                        message: "not correct credentials",
                    });
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
};

// ... (your other functions)

exports.register = async (req, res) => {
    try {
        const {name, email_id, contactnumber,password,passwordConfirm,} = req.body;
        // If the logged-in admin is registering another admin
        console.log(req.user);
        // console.log(req.user.role);
        if (req.user && req.user.role === "admin") {
            const checkQuery = "SELECT email_id FROM user WHERE email_id = ?";
            db.query(checkQuery, [email_id], async (checkErr, checkResults) => {
                if (checkErr) {
                    console.log(checkErr);
                    return res.status(500).send("Error occurred while checking email");
                }
                if (checkResults.length > 0) {
                    console.log("Email is already in use");
                    return res.status(400).sendFile(path + "public/register.html", {
                        message: "The email is already in use",
                    });
                } else if (password !== passwordConfirm) {
                    console.log("Password and confirm password don't match");
                    return res.status(400).sendFile(path + "public/register.html", {
                        message: "Passwords don't match",
                    });
                }
                // Hash the password
                let hashedPassword = await bcrypt.hash(password, times);
                // inserting admin data into user table
                const insertQuery = "INSERT INTO user SET ?";
                const insertValues = {
                    name: name,
                    phone_no: contactnumber,
                    email_id: email_id,
                };
                db.query(insertQuery, insertValues, (insertErr, insertResults) => {
                    if (insertErr) {
                        console.log(insertErr);
                        console.log("Error occured in inserting data for admin registration in user table");
                        return res.status(500).send("Error occurred while registering admin");
                    }
                    // Insert admin data into the database in password_manager table with role as "admin"
                    const insertQuery = "INSERT INTO password_manager SET ?";
                    const insertValues = {
                        email_id: email_id,
                        password: hashedPassword,
                        role: "admin",
                    };
                    db.query(insertQuery, insertValues, (insertErr, insertResults) => {
                        if (insertErr) {
                            console.log(insertErr);
                            console.log("Error occured in inserting data for admin registration in password_manager table");
                            return res.status(500).send("Error occurred while registering admin");
                        }
                        // cookie related 
                        // Create JWT token and set cookie
                        const token = jwt.sign({"id":email_id , "role":"admin" }, JWT_SECRET, {
                            expiresIn: JWT_EXPIRES_IN,
                        });

                        const cookieOptions = {
                            expires: new Date(Date.now() + JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                            httpOnly: true,
                        };
                        console.log("User Registered Successfully");
                        res.cookie("userSave", token, cookieOptions);
                        // Render the registration success page for admin registration
                        res.redirect("/adminprofile");
                    });
                });
            });
        } else {
            const checkQuery = "SELECT email_id FROM user WHERE email_id = ?";
            db.query(checkQuery, [email_id], async (checkErr, checkResults) => {
                if (checkErr) {
                    console.log(checkErr);
                    return res.status(500).send("Error occurred while checking email");
                }
                if (checkResults.length > 0) {
                    console.log("Email is already in use");
                    return res.status(400).sendFile(path + "public/register.html", {
                        message: "The email is already in use",
                    });
                } else if (password !== passwordConfirm) {
                    console.log("Password and confirm password don't match");
                    return res.status(400).sendFile(path + "public/register.html", {
                        message: "Passwords don't match",
                    });
                }
                // Hash the password
                let hashedPassword = await bcrypt.hash(password, times);

                // Insert admin data into the database with role as "admin"
                const insertQuery = "INSERT INTO user SET ?";
                const insertValues = {
                    name: name,
                    phone_no: contactnumber,
                    email_id: email_id,
                };
                db.query(insertQuery, insertValues, (insertErr, insertResults) => {
                    if (insertErr) {
                        console.log(insertErr);
                        console.log("Error occured in inserting data for user registration in user table");
                        return res.status(500).send("Error occurred while registering user");
                    }
                    const insertQuery = "INSERT INTO password_manager SET ?";
                    const insertValues = {
                        email_id: email_id,
                        password: hashedPassword,
                        role: "user",
                    };
                    db.query(insertQuery, insertValues, (insertErr, insertResults) => {
                        if (insertErr) {
                            console.log(insertErr);
                            console.log("Error occured in inserting data for user registration in password_manager table");
                            return res.status(500).send("Error occurred while registering user");
                        }
                        // cookie related 
                        // Create JWT token and set cookie
                        const token = jwt.sign({ "id": email_id, "role":"user"}, JWT_SECRET, {
                            expiresIn: JWT_EXPIRES_IN,
                        });
                        const cookieOptions = {
                            expires: new Date(
                                Date.now() + JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                            ),
                            httpOnly: true,
                        };
                        res.cookie("userSave", token, cookieOptions);
                        // Render the registration success page for user registration
                        console.log("User Registered Successfully");
                        // res.render("login");
                        res.redirect("login");
                    });
                });
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("An error occurred");
    }
};

exports.logout = (req, res) => {
    res.cookie("userSave", "logout", {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });
    res.status(200).redirect("/");
};

exports.isLoggedIn = async (req, res, next) => {
    console.log("req.cookie is " , req.cookies.userSave);
    if (req.cookies.userSave) {
        try {
            // 1. Verify the token
            const decoded = await promisify(jwt.verify)(
                req.cookies.userSave,JWT_SECRET
            );
            console.log(decoded);
            console.log(decoded.id);

            // 2. Check if the user still exist
            db.query("SELECT * FROM password_manager WHERE email_id = ?",[decoded.email_id],(err, results) => {
                    // console.log(results);
                    if (!results) {
                        return next();
                    }
                    req.user = results[0];
                    return next();
                }
            );
        } catch (err) {
            console.log(err);
            return next();
        }
    } else {
        next();
    }
};


const queryAsync = promisify(db.query).bind(db);

exports.changepassword = async (req, res) => {
  try {
    const { old_password, new_password, confirm_password } = req.body;
    const decoded = await promisify(jwt.verify)(
      req.cookies.userSave,
      JWT_SECRET
    );
    console.log(decoded);
    const email_id = decoded.id; // Get the email from authenticated user

    if (new_password !== confirm_password) {
      return res
        .status(400)
        .send("New password and confirm password don't match");
    }

    const [existingUser] = await queryAsync(
      "SELECT password FROM password_manager WHERE email_id = ?",
      [email_id]
    );

    if (
      !existingUser ||
      !(await bcrypt.compare(old_password, existingUser.password))
    ) {
      return res.status(401).send("Old password entered by you is not correct");
    }

    const hashedPassword = await bcrypt.hash(new_password, times);

    await queryAsync(
      "UPDATE password_manager SET password = ? WHERE email_id = ?",
      [hashedPassword, email_id]
    );

    return res.status(200).send("Password changed successfully");
  } catch (error) {
    console.error("An error occurred:", error);

    // Check if the error is due to JWT expiration
    if (error.name === "TokenExpiredError") {
      // Redirect the user to the login page
      return res.redirect("/login");
    }

    return res.status(500).send("Some error occurred");
  }
};






