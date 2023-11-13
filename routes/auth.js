const express = require("express");
const authController = require("../controllers/auth");
const managementController = require("../controllers/management");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// new management controller
router.post("/see", managementController.see);
router.post("/see/table", managementController.see.table);


module.exports = router;
