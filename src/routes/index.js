const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoute"));
router.use("/role", require("./roleRoute"));
router.use("/department", require("./departmentRoute"));
router.use("/assets", require("./assetsRoute"));
router.use("/emergencyContact", require("./emergencyContactRoute"));
router.use("/attendance", require("./attendanceRoute"));
router.use("/experienceDetails", require("./experienceDetailsRoute"));
router.use("/designation", require("./designationRoute"));
router.use("/bank", require("./bankDetailsRoute"));
router.use("/route", require("./routesRoute"));
router.use("/employee", require("./employeeRoute"));
router.use("/document", require("./documentRoute"));
router.use("/leaveMaster", require("./leaveMasterRoute"));

module.exports = (app) => {
  app.use("/", router);
};
