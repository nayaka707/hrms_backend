const AdminController = require("./AdminController/adminIndex");
const EmployeeController = require("./EmployeeController/employeeIndex");
const EmployeeDocument = require("./EmployeeDocument/employeeDocumentIndex");
const DepartmentIndex = require("./Department/departmentIndex");
const AttendanceIndex = require("./Attendance/attendanceIndex");

module.exports = {
  AdminController,
  EmployeeController,
  EmployeeDocument,
  DepartmentIndex,
  AttendanceIndex
};
