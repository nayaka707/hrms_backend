const { verifyToken, checkRole } = require("../middlewares/auth");
const { checkToken } = require("../middlewares/resetPWAuth");
const {
  AdminController,
  EmployeeController,
  EmployeeDocument,
  DepartmentIndex,
  AttendanceController
} = require("../controllers/index");
// const { verifyToken, checkRole } = require("../middlewares/auth");

module.exports = (app) => { 
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"),
      res.header("Access-Control-Expose-Headers", "Content-Disposition");
    next();
  });

  app.get("/readPermission", [verifyToken], AdminController.readPermission);
  app.get(
    "/routePermission/:routeId",
    [verifyToken],
    AdminController.routePermission
  );
  app.post("/addEmployee", [verifyToken], EmployeeController.addEmployee);
  app.post("/employeeLogin", EmployeeController.employeeLogin);
  app.post("/forgot-password", [checkToken], EmployeeController.forgetPassword);
  app.post("/resetPassword", [verifyToken], EmployeeController.resetPassword);
  app.get("/getAllEmployees", EmployeeController.getAllEmployeesData);
  app.put(
    "/updateEmployeeData/:employeeId",
    EmployeeController.updateEmployeeData
  );
  app.get(
    "/getByIdEmployee",
    [verifyToken],
    EmployeeController.getByIdEmployeesData
  );
  app.post(
    "/employeeDocument",
    [verifyToken],
    EmployeeDocument.addEmployeeDocument
  );
  app.get("/getAllDepartment", [verifyToken], DepartmentIndex.getAllDepartment);
  app.post("/addAttendance", AttendanceController.addEmployeeAttendance);
  app.get("/dailylogs", AttendanceController.getAllAttendance);
};
