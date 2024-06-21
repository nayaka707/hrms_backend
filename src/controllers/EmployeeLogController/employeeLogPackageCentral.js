const models = require("../../models/associations");
const Sequelize = require("sequelize");
const { Employees, Role, Attendance, EmployeeLogDetails, WorkLogs } = models;

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
    statusCode,
    WorkLogs,
    Sequelize

}