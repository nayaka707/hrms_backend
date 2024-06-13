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
} = require("../utils/utilsIndex");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      logger.warn(
        errorResponseFunc(
          "No token provided.",
          "No token provided.",
          statusCode.badRequest,
          constants.BADREQUEST
        )
      );
      res.send(
        errorResponseFunc(
          "No token provided.",
          "No token provided.",
          statusCode.badRequest,
          constants.BADREQUEST
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
        res.send(
          errorResponseFunc(
            "Please log in again.",
            "Please log in again.",
            statusCode.unauthorized,
            constants.UNAUTHORIZED
          )
        );
      } else {
        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
          if (err) {
            logger.warn(
              errorResponseFunc(
                "Invalid token.",
                "Invalid token.",
                statusCode.badRequest,
                constants.BADREQUEST
              )
            );
            res.send(
              errorResponseFunc(
                "Invalid token.",
                "Invalid token.",
                statusCode.badRequest,
                constants.BADREQUEST
              )
            );
          } else {
            console.log("decoded :::",decoded);
            req.loggersId = decoded.id;
            req.roleId = decoded.roleId;
            req.roleName = decoded.role;

            if (!decoded.roleId) {
              logger.warn(
                errorResponseFunc(
                  "Invalid token.",
                  "Invalid token.",
                  statusCode.badRequest,
                  constants.BADREQUEST
                )
              );
              res.send(
                errorResponseFunc(
                  "Invalid token.",
                  "Invalid token.",
                  statusCode.badRequest,
                  constants.BADREQUEST
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
