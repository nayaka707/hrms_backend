const { verifyToken, checkRole } = require("../middlewares/auth");
const { checkToken } = require("../middlewares/resetPWAuth");
<<<<<<< Updated upstream
const { AdminController, EmployeeController, UserController } = require("../controllers/index");
=======
const {
  AdminController,
  EmployeeController,
  UserController,
} = require("../controllers/index");
>>>>>>> Stashed changes
// const { verifyToken, checkRole } = require("../middlewares/auth");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"),
      res.header("Access-Control-Expose-Headers", "Content-Disposition");
    next();
  });

  app.post("/addSuperAdmin", AdminController.addAdmin);
<<<<<<< Updated upstream
  app.post('/employeeLogin', EmployeeController.employeeLogin)
  app.post('/forgot-password', [checkToken], EmployeeController.forgetPassword)
  app.post(
    "/resetPassword",
    [verifyToken],
    EmployeeController.resetPassword
  );
  app.get("/getAllEmployees", EmployeeController.getAllEmployeesData);
  app.put("/updateEmployeeData/:employeeId", EmployeeController.updateEmployeeData)
=======
  app.post("/employeeLogin", UserController.userLogin);
  app.post("/forgot-password", [checkToken], UserController.passwordReset);
  app.post("/resetPassword", [verifyToken], EmployeeController.resetPassword);
  app.get("/getAllEmployees", EmployeeController.getAllEmployeesData);
  app.get(
    "/getByIdEmployee",
    [verifyToken],
    EmployeeController.getByIdEmployeesData
  );
>>>>>>> Stashed changes
};
