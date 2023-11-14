const express = require("express");
const authController = require("../controllers/auth");
const managementController = require("../controllers/management");
const router = express.Router();
router.get("/", (req, res) => {
  res.sendFile("main.html", { root: "./public/" });
});
router.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "./public/" });
});
router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "./public/" });
});
router.get("/logout", authController.logout, (req, res) => {
  res.sendFile("main.html", { root: "./public/" });
});
router.get("/adminprofile", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.sendFile("adminprofile.ejs", { root: "./views/" });
  } else {
    res.sendFile("login.html", { root: "./public/" });
  }
});
router.get("/userprofile", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.sendFile("userprofile.ejs", { root: "./views/" });
  } else {
    res.sendFile("login.html", { root: "./public/" });
  }
});

// new management code
router.get("/see", managementController.see, (req, res) => {
  // console.log("Hi");
  // res.render("see");
});
router.post("/see/table", managementController.see.table, (req, res) => {
  // console.log("Hello");
  // res.render("seeTable");
});

const userProfile = {
  name: "John Doe",
  account_no: "123456789",
  email_id: "john@example.com",
  balance: 1000,
  phone_no: "123-456-7890",
  role: "user",
};

// Route to render the profile page
router.get("/profile", (req, res) => {
  console.log(req.user);
  res.send(userProfile);
});
// router.get(
//   "/profile",
//   authController.isLoggedIn,
//   managementController.profiledata,
//   (req, res) => {
//     const profileData = req.profiledata;
//     console.log(profileData);
//     console.log("Himanshu Gupta")
//     res.json(profileData)
//     res.send(profileData);
//   }
// );

router.post(
  "/changepassword",
  authController.isLoggedIn,
  authController.changepassword,
  (req, res) => {
    // authController.isLoggedIn(req, res, authController.changepassword);
    const { old_password, new_password, confirm_password } = req.body;
    console.log(old_password + " " + new_password + " " + confirm_password);
    res.send(old_password + " " + new_password + " " + confirm_password);
    // res.sendFile("changepassword.html" , {root : "./public/"})
  }
);

// for 404 page
router.get("*", (req, res) => {
  res.send(`<h1>404 Page not found</h1>`);
});

module.exports = router;
