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
const ExperienceDetailsController = require("./ExperienceDetailsController/experienceDetailsIndex");
const AssetsController = require("./AssetsController/assetsIndex");
const EmergencyContactController = require("./EmergencyContactController/emergencyContactIndex");
const EmployeeLogController = require('./EmployeeLogController/employeeLogIndex')
const LeaveMasterController = require('./LeaveMasterController/leaveMasterIndex')

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
  ExperienceDetailsController,
  AssetsController,
  EmergencyContactController,
  EmployeeLogController,
  LeaveMasterController
};
