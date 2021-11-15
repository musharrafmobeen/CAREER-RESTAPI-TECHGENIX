const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");

router.post("/login", adminControllers.Admin_Log_In);

module.exports = router;
