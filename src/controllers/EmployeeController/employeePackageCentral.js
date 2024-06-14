const models = require("../../models/associations");
const {
  Employees,
  Role,
  Route,
  BankDetails,
  EmergencyContacts,
  EmployeeDocuments,
  ExperienceDetails,
  Assets,
  Department,
  Designation,
} = models;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_MAXAGE = process.env.TOKEN_MAXAGE;
const TOKEN_SECRET = process.env.TOKEN_SECRET;
// const PUBLIC_URL = process.env.PUBLIC_URL
const {
  constants,
  responseMessage,
  statusCode,
  errorResponseFunc,
  successResponseFunc,
  unlinkFiles,
  temporaryPasswordString,
  sendEmail,
} = require("../../utils/utilsIndex");
require("dotenv").config();
const Sequelize = require("sequelize");
const path = require("path");
const logger = require("../../services/loggerService");

const { Op } = require("sequelize");
const PUBLIC_URL =
  "http://192.168.29.38:9000/src/public/uploads/profilePicture/profilePicture-1718089217891-322913627.jpg";
// D:\workroot\darshit\HRMS_BACKEND\hrms_backend\src\public\uploads\profilePicture\profilePicture-1718089217891-322913627.png
module.exports = {
  Employees,
  bcrypt,
  BankDetails,
  EmergencyContacts,
  EmployeeDocuments,
  ExperienceDetails,
  Assets,
  Department,
  Designation,
  constants,
  jwt,
  statusCode,
  models,
  responseMessage,
  Role,
  successResponseFunc,
  errorResponseFunc,
  temporaryPasswordString,
  unlinkFiles,
  PUBLIC_URL,
  Op,
  path,
  logger,
  TOKEN_SECRET,
  TOKEN_MAXAGE,
  sendEmail,
  Route,
  Sequelize,
};
