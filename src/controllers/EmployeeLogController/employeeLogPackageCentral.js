const models = require("../../models/associations");
const { Employees, Role, Attendance, EmployeeLogDetails } = models;

const {
    logger,
    constants,
    responseFunc,
    responseMessage,
    statusCode,
    errorResponseFunc,
    successResponseFunc,

} = require("../../utils/utilsIndex");


module.exports = {
    logger,
    Employees,
    EmployeeLogDetails,
    constants,
    successResponseFunc,
    errorResponseFunc,
    statusCode

}