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
console.log('tokensercret', TOKEN_SECRET)

const checkToken = (req, res, next) => {
    console.log('req.userId', req.userId);
    try {

        let token = req.get("authorization");
        if (!token) {
            return res.status(403).json({
                message: "Token is Required",
                status: false,
            });
        }

        const tk = token.split(" ");
        if (!tk[1]) {
            tk.unshift("Bearer");
        }
        jwt.verify(tk[1], TOKEN_SECRET, async (err, decoded) => {
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
                req.userId = decoded.userId;
                next();
            }
        });

    } catch (err) {
        console.log('errrrrr', err)
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