const { constants, responseFunc, responseMessage, statusCode, errorResponseFunc, successResponseFunc, models , logger} = require('../../utils/utilsIndex')



const getAllRoles = async (req, res) => {
    try {
        const roles = await models.Role.findAll({})
        res.send(
            successResponseFunc(
                "Here is the roles data.",
                statusCode.success,
                constants.SUCCESS,
                roles
            )
        );
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
}

module.exports = { getAllRoles }