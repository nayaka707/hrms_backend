const logger = require("../services/loggerService");
const jwt = require('jsonwebtoken')
const {
    statusCode,
    tokenBlackList,
    constants,
    errorResponseFunc,
    pwResetTokenBlackList,
} = require("../utils/utilsIndex");

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const checkToken = (req, res, next) => {
    try {

        let token = req.headers["x-access-token"];
        if (!token) {
            return res.status(403).json({
                message: "Token is Required",
                status: false,
            });
        }
        jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(403).json({
                        message: "Token has expired",
                        status: false,
                        data: null,
                    });
                } else {
                    return res.status(403).json({
                        message: "Invalid Token",
                        status: false,
                        data: null,
                    });
                }
            } else {
                req.employeeId = decoded.employeeId;
                next();
            }
        });

    } catch (err) {
        logger.error(
            errorResponseFunc(
                "Encountered some error.",
                err.toString(),
                statusCode.internalServerError,
                constants.ERROR
            )
        );
        res.send(
            errorResponseFunc(
                "Encountered some error.",
                err.toString(),
                statusCode.internalServerError,
                constants.ERROR
            )
        );
    }
};



module.exports = { checkToken };