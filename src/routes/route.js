const { verifyToken, checkRole } = require("../middlewares/auth");
const { checkToken } = require("../middlewares/resetPWAuth");
const { AdminController, EmployeeController, BankController, DesignationController, RoleController, DepartmentController, RouteController, EmployeeDocument, AttendanceController } = require("../controllers/index");
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
  
  app.post("/addEmployee", [verifyToken], EmployeeController.addEmployee);
  app.post("/employeeLogin", EmployeeController.employeeLogin);
  app.get("/logOut", EmployeeController.logOut);
  app.post("/forgot-password", EmployeeController.forgotPassword);
  app.post("/verify-password", [verifyToken], EmployeeController.verifyPassword);
  app.post("/resetPassword", [verifyToken], EmployeeController.resetPassword);
  app.get(
    "/getAllEmployees",
    [verifyToken],
    EmployeeController.getAllEmployeesData
  );
  app.put(
    "/updateEmployeeData/:employeeId",
    [checkToken],
    EmployeeController.updateEmployeeData
  );
  app.delete(
    "/deleteEmployee/:employeeId",
    [verifyToken],
    EmployeeController.deleteEmployee
  );

  app.get('/getReportPerson', [verifyToken], EmployeeController.getReportTo);
  app.get("/getByIdEmployee", [verifyToken], EmployeeController.getByIdEmployeesData );
  app.post("/employeeDocument", [verifyToken], EmployeeDocument.addEmployeeDocument );

  // Attendance Routes
  app.post("/addAttendance", AttendanceController.addEmployeeAttendance);
  app.get("/dailylogs", AttendanceController.getAllAttendance);

  // Bank Routes
  app.post('/addBank', [checkToken], BankController.addBankDetails)
  app.delete('/deleteBank/:bankId', [checkToken], BankController.deleteBankDetails)
  app.get('/getBank', [checkToken], BankController.getBankDetailByEmployee)

  // Designation Routes
  app.post('/addDesignation', [verifyToken], DesignationController.createDesignation);
  app.get('/getAllDesignation',[verifyToken], DesignationController.getAllDesignation)
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

  app.get('/getAllRoutes', [verifyToken], RouteController.getAllRoutes);

};
