const jwt = require("jsonwebtoken");
require("dotenv").config();
const defineAbilities = require("../accessPolicies/accessPolicies");
const logger = require("../services/loggerService");

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const {
  statusCode,
  tokenBlackList,
  constants,
  errorResponseFunc,
  models,
} = require("../utils/utilsIndex");
const { Employees } = models;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      logger.warn(
        errorResponseFunc(
          "No token provided.",
          "No token provided.",
          statusCode.unauthorized,
          constants.UNAUTHORIZED
        )
      );
      res.status(statusCode.unauthorized).send(
        errorResponseFunc(
          "No token provided.",
          "No token provided.",
          statusCode.unauthorized,
          constants.UNAUTHORIZED
        )
      );
    } else {
      if (tokenBlackList.includes(token)) {
        logger.warn(
          errorResponseFunc(
            "Please log in again.",
            "Please log in again.",
            statusCode.unauthorized,
            constants.UNAUTHORIZED
          )
        );
        res.status(statusCode.unauthorized).send(
          errorResponseFunc(
            "Please log in again.",
            "Please log in again.",
            statusCode.unauthorized,
            constants.UNAUTHORIZED
          )
        );
      } else {
        jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
          if (err) {
            logger.warn(
              errorResponseFunc(
                "Invalid token.",
                "Invalid token.",
                statusCode.unauthorized,
                constants.UNAUTHORIZED
              )
            );
            res.status(statusCode.unauthorized).send(
              errorResponseFunc(
                "Invalid token.",
                "Invalid token.",
                statusCode.unauthorized,
                constants.UNAUTHORIZED
              )
            );
          } else {
            req.loggersId = decoded.id;
            req.roleId = decoded.roleId;
            req.roleName = decoded.role;

            const user = await Employees.findOne({ where: { id: decoded.id } });
            if (user.sessionId !== decoded.sessionId) {
              logger.warn(
                errorResponseFunc(
                  "Invalid session.",
                  "Invalid session.",
                  statusCode.unauthorized,
                  constants.UNAUTHORIZED
                )
              );
              res.status(statusCode.unauthorized).send(
                errorResponseFunc(
                  "Invalid session.",
                  "Invalid session.",
                  statusCode.unauthorized,
                  constants.UNAUTHORIZED
                )
              );
            } else if (!decoded.roleId) {
              logger.warn(
                errorResponseFunc(
                  "Invalid token.",
                  "Invalid token.",
                  statusCode.unauthorized,
                  constants.UNAUTHORIZED
                )
              );
              res.status(statusCode.unauthorized).send(
                errorResponseFunc(
                  "Invalid token.",
                  "Invalid token.",
                  statusCode.unauthorized,
                  constants.UNAUTHORIZED
                )
              );
            } else {
              next();
            }
          }
        });
      }
    }
  } catch (err) {
    logger.error(
      errorResponseFunc(
        "Encountered some error while verifying the token.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    res.send(
      errorResponseFunc(
        "Encountered some error while verifying the token.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};
const checkRole = async (req, res, next) => {
  try {
    const userData = {};
    userData.loggersId = req.loggersId;
    userData.roleId = req.roleId;

    const ability = await defineAbilities(req, userData);
    req.ability = ability;

    next();
  } catch (err) {
    if (err === "Role not found.") {
      logger.warn(
        errorResponseFunc(
          "This Role does not exist.",
          "Role not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      res.send(
        errorResponseFunc(
          "This Role does not exist.",
          "Role not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    } else {
      logger.error( 
        errorResponseFunc(
          "Encountered some error while checking the role.",
          err.toString(),
          statusCode.internalServerError,
          constants.ERROR
        )
      );
      res.send(
        errorResponseFunc(
          "Encountered some error while checking the role.",
          err.toString(),
          statusCode.internalServerError,
          constants.ERROR
        )
      );
    }
  }
};

module.exports = { verifyToken, checkRole };
