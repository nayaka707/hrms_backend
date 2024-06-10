const { resetPassword, forgetPassword } = require("./passwordReset");
const { getAllEmployeesData } = require("./getEmployee");
const { updateEmployeeData } = require("./updateEmployeeData")
const { employeeLogin } = require("./employeeLogin")
module.exports = { resetPassword, employeeLogin, forgetPassword, getAllEmployeesData, updateEmployeeData };
