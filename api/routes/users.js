const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/users");

router.post("/register", userControllers.registerUser);
router.get("/verifyUser/:verificationId", userControllers.verifyUser);
router.post("/login", userControllers.userLogIn);

module.exports = router;
