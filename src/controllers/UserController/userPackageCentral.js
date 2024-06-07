const models = require("../../models/associations");
const { Employees, Role } = models;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_MAXAGE = process.env.TOKEN_MAXAGE
const TOKEN_SECRET = process.env.TOKEN_SECRET
const {
    constants,
    responseFunc,
    responseMessage,
    statusCode,
    errorResponseFunc,
    successResponseFunc,
    sendEmail
} = require("../../utils/utilsIndex")



module.exports = {
    Employees,
    constants,
    responseFunc,
    successResponseFunc,
    errorResponseFunc,
    statusCode,
    responseMessage,
    jwt,
    bcrypt,
    Role,
    TOKEN_MAXAGE,
    TOKEN_SECRET,
    sendEmail
}