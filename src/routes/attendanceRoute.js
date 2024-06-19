const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { EmployeeLogController } = require("../controllers/index");


router.post('/employeeLog/create', [verifyToken], EmployeeLogController.createEmployeeLogDetails)
router.get('/getByEmployeeCode', [verifyToken], EmployeeLogController.getEmployeeLogDetails)
//  // Attendance Routes
//  app.post("/addAttendance",[verifyToken], AttendanceController.addEmployeeAttendance);
//  app.get("/dailylogs",[verifyToken], AttendanceController.getAllAttendance);

module.exports = router;