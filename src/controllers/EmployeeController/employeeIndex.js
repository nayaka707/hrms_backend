const { resetPassword, forgetPassword } = require("./passwordReset");
const { getAllEmployeesData, getByIdEmployeesData } = require("./getEmployee");
const { updateEmployeeData } = require("./updateEmployeeData");
const { employeeLogin } = require("./employeeLogin");
const { addEmployee } = require("./addEmployee");
const { deleteEmployee } = require("./deleteEmployee");

module.exports = {
  resetPassword,
  employeeLogin,
  forgetPassword,
  getAllEmployeesData,
  updateEmployeeData,
  deleteEmployee,
  getByIdEmployeesData,
  addEmployee,
};
