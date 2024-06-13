const { resetPassword, forgetPassword, forgotPassword, verifyPassword } = require("./passwordReset");
const { getAllEmployeesData, getByIdEmployeesData } = require("./getEmployee");
const { updateEmployeeData } = require("./updateEmployeeData");
const { employeeLogin } = require("./employeeLogin");
const { addEmployee } = require("./addEmployee");
const { deleteEmployee } = require("./deleteEmployee");
const { getReportTo } = require("./reportTo");

module.exports = {
  resetPassword,
  employeeLogin,
  forgetPassword,
  getAllEmployeesData,
  updateEmployeeData,
  deleteEmployee,
  getByIdEmployeesData,
  addEmployee,
  getReportTo,
  forgotPassword,
  verifyPassword,
};
