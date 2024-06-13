const AdminController = require("./AdminController/adminIndex");
const EmployeeController = require("./EmployeeController/employeeIndex");
const EmployeeDocument = require("./EmployeeDocument/employeeDocumentIndex");
const DepartmentIndex = require("./DepartmentController/departmentIndex");
const AttendanceController = require("./AttendanceController/attendanceIndex");
const BankController = require("./BankController/bankIndex")
const DesignationController = require('./DesignationController/designationIndex')
const RoleController = require('./RoleController/roleIndex')
const DepartmentController = require("./DepartmentController/departmentIndex");
const RouteController = require("./RoutesController/routesIndex");

module.exports = {
  AdminController,
  EmployeeController,
  EmployeeDocument,
  DepartmentIndex,
  AttendanceController,
  BankController,
  DesignationController,
  RoleController,
  DepartmentController,
  RouteController,
};
