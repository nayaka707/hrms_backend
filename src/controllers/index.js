const AdminController = require("./AdminController/adminIndex");
const EmployeeController = require("./EmployeeController/employeeIndex");
const EmployeeDocument = require("./EmployeeDocument/employeeDocumentIndex");
const DepartmentIndex = require("./DepartmentController/departmentIndex");
const AttendanceController = require("./AttendanceController/attendanceIndex");

module.exports = {
  AdminController,
  EmployeeController,
  EmployeeDocument,
  DepartmentIndex,
  AttendanceController
};
