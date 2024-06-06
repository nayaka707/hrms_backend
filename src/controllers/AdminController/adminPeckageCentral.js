const models = require("../../models/associations");
const { Admin, Role } = models;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const TOKEN_MAXAGE = process.env.TOKEN_MAXAGE;
const fs = require("fs");
const path = require("path");
const {
  temporaryPasswordString,
  constants,
  responseFunc,
  responseMessage,
  statusCode,
  errorResponseFunc,
  successResponseFunc,
} = require("../../utils/utilsIndex");
const logger = require("../../services/loggerService");
module.exports = {
  Admin,
  bcrypt,
  jwt,
  statusCode,
  responseMessage,
  Role,
  constants,
  TOKEN_MAXAGE,
  temporaryPasswordString,
  responseFunc,
  successResponseFunc,
  errorResponseFunc,
  fs,
  path,
  logger,
};
