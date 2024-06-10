<<<<<<< Updated upstream
const { resetPassword, forgetPassword } = require("./passwordReset");
const { getAllEmployeesData } = require("./getEmployee");
const { updateEmployeeData } = require("./updateEmployeeData")
const { employeeLogin } = require("./employeeLogin")
module.exports = { resetPassword, employeeLogin, forgetPassword, getAllEmployeesData, updateEmployeeData };
=======
const { resetPassword } = require("./passwordReset");
const { getAllEmployeesData, getByIdEmployeesData } = require("./getEmployee");
module.exports = { resetPassword, getAllEmployeesData , getByIdEmployeesData};
>>>>>>> Stashed changes
