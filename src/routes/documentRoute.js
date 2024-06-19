const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { EmployeeDocument } = require("../controllers/index");

router.post("/add", [verifyToken], EmployeeDocument.addEmployeeDocument);

module.exports = router;