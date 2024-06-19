const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { AdminController, EmployeeController } = require("../controllers/index");


router.get("/readPermission", [verifyToken], AdminController.readPermission);
router.get("/routePermission/:routeId", [verifyToken], AdminController.routePermission);
router.post("/employeeLogin", EmployeeController.employeeLogin);
router.get("/logOut",[verifyToken], EmployeeController.logOut);
router.post("/forgot-password", EmployeeController.forgotPassword);
router.post("/verify-password", [verifyToken], EmployeeController.verifyPassword);
router.post("/resetPassword", [verifyToken], EmployeeController.resetPassword);

module.exports = router;