const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { EmployeeLogController } = require("../controllers/index");


router.post('/employeeLog/create', EmployeeLogController.createEmployeeLogDetails)
router.get('/getByEmployeeCode', EmployeeLogController.getEmployeeLogDetails)
router.get('/employeeMonthlyAttendance', EmployeeLogController.employeeMonthlyAttendance )
//  // Attendance Routes
//  app.post("/addAttendance",[verifyToken], AttendanceController.addEmployeeAttendance);
//  app.get("/dailylogs",[verifyToken], AttendanceController.getAllAttendance);

module.exports = router;