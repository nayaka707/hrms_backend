const { verifyToken, checkRole } = require("../middlewares/auth");
const { checkToken } = require("../middlewares/resetPWAuth");
const { AdminController, EmployeeController, BankController, DesignationController, RoleController, DepartmentController, RouteController, EmployeeDocument, AttendanceController, ExperienceDetailsController, AssetsController, EmergencyContactController, EmployeeLogController, ProjectController } = require("../controllers/index");
// const { verifyToken, checkRole } = require("../middlewares/auth");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"),
      res.header("Access-Control-Expose-Headers", "Content-Disposition");
    next();
  });

  // Permission Routes
  app.get("/readPermission", [verifyToken], AdminController.readPermission);
  app.get("/routePermission/:routeId", [verifyToken], AdminController.routePermission);
  app.get('/getAllRoutes', [verifyToken], RouteController.getAllRoutes);

  app.post("/addEmployee", [verifyToken], EmployeeController.addEmployee);
  app.post("/employeeLogin", EmployeeController.employeeLogin);
  app.get("/logOut", [verifyToken], EmployeeController.logOut);
  app.post("/forgot-password", EmployeeController.forgotPassword);
  app.post("/verify-password", [verifyToken], EmployeeController.verifyPassword);
  app.post("/resetPassword", [verifyToken], EmployeeController.resetPassword);
  app.get("/getAllEmployees", [verifyToken], EmployeeController.getAllEmployeesData);
  app.put("/updatePersonalDetails/:employeeId", [verifyToken], EmployeeController.updateEmployeeData);
  app.put("/updateSignUpDetails/:employeeId", [verifyToken], EmployeeController.updateSignUpDetails);
  app.delete("/deleteEmployee/:employeeId", [verifyToken], EmployeeController.deleteEmployee);

  app.get('/getReportPerson', [verifyToken], EmployeeController.getReportTo);
  app.get("/getByIdEmployee/:id?", [verifyToken], EmployeeController.getByIdEmployeesData);
  app.post("/employeeDocument", [verifyToken], EmployeeDocument.addEmployeeDocument);

  // Attendance Routes
  app.post("/addAttendance", [verifyToken], AttendanceController.addEmployeeAttendance);
  app.get("/dailylogs", [verifyToken], AttendanceController.getAllAttendance);

  // Bank Routes
  app.post('/addBank', [verifyToken], BankController.addBankDetails)
  app.delete('/deleteBank/:bankId', [verifyToken], BankController.deleteBankDetails)
  app.get('/getBank', [verifyToken], BankController.getBankDetailByEmployee)

  // Designation Routes
  app.post('/addDesignation', [verifyToken], DesignationController.createDesignation);
  app.get('/getAllDesignation', [verifyToken], DesignationController.getAllDesignation)
  app.put('/updateDesignation/:id', [verifyToken], DesignationController.updateDesignation);
  app.put('/deleteDesignation/:id', [verifyToken], DesignationController.deleteDesignation);

  // Role Routes
  app.get('/getAllRoles', [verifyToken], RoleController.getAllRoles);
  app.get('/getRole/:id', [verifyToken], RoleController.getRole);
  app.post('/createRole', [verifyToken], RoleController.createRole);
  app.put('/deleteRole/:id', [verifyToken], RoleController.deleteRole);
  app.post('/updateRole', [verifyToken], RoleController.updateRole);

  // Department Routes
  app.post('/addDepartment', [verifyToken], DepartmentController.createDepartment);
  app.get('/getAllDepartment', [verifyToken], DepartmentController.getAllDepartment);
  app.put('/updateDepartment/:id', [verifyToken], DepartmentController.updateDepartment);
  app.put('/deleteDepartment/:id', [verifyToken], DepartmentController.deleteDepartment);

  // ExperienceDetails Routes
  app.post('/addExperienceDetails', [verifyToken], ExperienceDetailsController.addExperienceDetails);
  app.delete('/deleteExperienceDetails', [verifyToken], ExperienceDetailsController.deleteExperienceDetails);

  // Assets Routes
  app.post('/addAssets', [verifyToken], AssetsController.addAssets);
  app.delete('/deleteAssets', [verifyToken], AssetsController.deleteAssets);

  // EmergencyContact Routes
  app.post('/addEmergencyContact', [verifyToken], EmergencyContactController.addEmergencyContacts);
  app.delete('/deleteEmergencyContact', [verifyToken], EmergencyContactController.deleteEmergencyContacts);

  app.post('/attendance/employeeLog/create', [verifyToken], EmployeeLogController.createEmployeeLogDetails)
  app.get('/attendance/getByEmployeeCode', [verifyToken], EmployeeLogController.getEmployeeLogDetails)

  // projects
  app.post('/project/add', [verifyToken], ProjectController.addProject)
  app.get('/project/getById/:projectId', [verifyToken], ProjectController.getProjectById)
  app.get('/project/getAll/', [verifyToken], ProjectController.getAllProjects)
  app.delete('/project/delete/:projectId', [verifyToken], ProjectController.deleteProject)

  // workLog
  app.post('/workLog/create', [verifyToken], EmployeeController.createWorkLog)
  app.get('/workLog/getByEmployeeId', [verifyToken],EmployeeController.getWorkLogByEmployeeId)

};
