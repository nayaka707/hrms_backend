const { verifyToken, checkRole } = require("../middlewares/auth");
const { checkToken } = require("../middlewares/resetPWAuth");
const { AdminController, EmployeeController, BankController, DesignationController, RoleController, DepartmentController } = require("../controllers/index");
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
  
  app.post("/addSuperAdmin", AdminController.addAdmin);
  app.post('/employeeLogin', EmployeeController.employeeLogin)
  app.post('/forgot-password', [checkToken], EmployeeController.forgetPassword)
  app.post(
    "/resetPassword",
    [verifyToken],
    EmployeeController.resetPassword
  );
  app.get("/getAllEmployees", EmployeeController.getAllEmployeesData);
  app.put("/updateEmployeeData/:employeeId", [checkToken], EmployeeController.updateEmployeeData)
  app.delete('/deleteEmployee/:employeeId', [verifyToken], EmployeeController.deleteEmployee)
  app.get(
    "/getByIdEmployee",
    [verifyToken],
    EmployeeController.getByIdEmployeesData
  );

  // Bank Routes
  app.post('/addBank', [checkToken], BankController.addBankDetails)
  app.delete('/deleteBank/:bankId', [checkToken], BankController.deleteBankDetails)
  app.get('/getBank', [checkToken], BankController.getBankDetailByEmployee)

  // Designation Routes
  app.post('/addDesignation', [verifyToken], DesignationController.createDesignation);
  app.get('/getAllDesignation',[verifyToken], DesignationController.getAllDesignation)
  app.put('/updateDesignation', [verifyToken], DesignationController.updateDesignation);
  app.put('/deleteDesignation', [verifyToken], DesignationController.deleteDesignation);

  // Role Routes
  app.get('/getAllRoles', [verifyToken], RoleController.getAllRoles);
  app.get('/getRole', [verifyToken], RoleController.getRole);
  app.post('/createRole', [verifyToken], RoleController.createRole);
  app.put('/deleteRole', [verifyToken], RoleController.deleteRole);
  app.post('/updateRole', [verifyToken], RoleController.updateRole);

  // Department Routes
  app.post('/addDepartment', [verifyToken], DepartmentController.createDepartment);
  app.get('/getAllDepartment', [verifyToken], DepartmentController.getAllDepartment);
  app.put('/updateDepartment', [verifyToken], DepartmentController.updateDepartment);
  app.put('/deleteDepartment', [verifyToken], DepartmentController.deleteDepartment);

};
