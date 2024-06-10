const { verifyToken, checkRole } = require("../middlewares/auth");
const { checkToken } = require("../middlewares/resetPWAuth");
const { AdminController, EmployeeController } = require("../controllers/index");
// const { verifyToken, checkRole } = require("../middlewares/auth");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"),
      res.header("Access-Control-Expose-Headers", "Content-Disposition");
    next();
  });

  app.post("/addSuperAdmin", AdminController.addAdmin);
  app.post('/employeeLogin', EmployeeController.employeeLogin)
  app.post('/forgot-password', [checkToken], EmployeeController.forgetPassword)
  app.post(
    "/resetPassword",
    [verifyToken],
    EmployeeController.resetPassword
  );
  app.get("/getAllEmployees", EmployeeController.getAllEmployeesData);
  app.put("/updateEmployeeData/:employeeId", EmployeeController.updateEmployeeData)
  app.get(
    "/getByIdEmployee",
    [verifyToken],
    EmployeeController.getByIdEmployeesData
  );
};
