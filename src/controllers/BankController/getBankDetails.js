const { constants, statusCode, errorResponseFunc, successResponseFunc, models } = require('../../utils/utilsIndex')




const getBankDetailsByEmployee = async (req, res) => {
    try {
        const employeeId = req.employeeId
        const employeeBank = await models.BankDetails.findOne({ where: { employeeId } })
        if (!employeeBank) {
            logger.warn(
                errorResponseFunc(
                    "Employee bank details not found", "No Bank Found", statusCode.badRequest, constants.BADREQUEST));
            res.send(
                errorResponseFunc(
                    "There is no request body.", "No request body.", statusCode.badRequest, constants.BADREQUEST));
        }
        return res.send(successResponseFunc('Successfully get bank details', statusCode.success, constants.SUCCESS, employeeBank))

    } catch (err) {
        logger.error(errorResponseFunc(
            "Encountered error in getBankDetailsByEmployee", err.toString(), statusCode.internalServerError, constants.ERROR));

        res.send(
            errorResponseFunc(
                "Encountered error in getBankDetailsByEmployee", err.toString(), statusCode.internalServerError, constants.ERROR)
        );

    }
}

module.exports = getBankDetailsByEmployee