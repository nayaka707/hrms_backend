const { constants, responseFunc, responseMessage, statusCode, errorResponseFunc, successResponseFunc, models , logger} = require('../../utils/utilsIndex')



const getAllDesignation = async (req, res) => {
    try {
        const designation = await models.Designation.findAll({
            where : {isActive : constants.ACTIVE}
        });
        res.send(
            successResponseFunc(
                "Here is the designation data.",
                statusCode.success,
                constants.SUCCESS,
                designation
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

module.exports = { getAllDesignation }