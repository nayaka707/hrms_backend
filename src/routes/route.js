const { verifyToken, checkRole } = require("../middlewares/auth");
const { checkToken } = require("../middlewares/resetPWAuth");
const { AdminController, EmployeeController, BankController, DesignationController, RoleController } = require("../controllers/index");
// const { verifyToken, checkRole } = require("../middlewares/auth");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"),
      res.header("Access-Control-Expose-Headers", "Content-Disposition");
    next();
  });

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
  app.post('/addBank', [checkToken], BankController.addBankDetails)
  app.delete('/deleteBank/:bankId', [checkToken], BankController.deleteBankDetails)
  app.get('/getBank', [checkToken], BankController.getBankDetailByEmployee)
  app.get('/getAllDesignation', DesignationController.getAllDesignation)
  app.get('/getAllRoles', RoleController.getAllRoles)

};
