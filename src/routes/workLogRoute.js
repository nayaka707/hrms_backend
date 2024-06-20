const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth")

const { WorkLogController } = require("../controllers/index");

router.post("/create", [verifyToken], WorkLogController.createWorkLog)

router.get("/getByEmployeeId", [verifyToken], WorkLogController.getWorkLogByEmployeeId)
module.exports = router