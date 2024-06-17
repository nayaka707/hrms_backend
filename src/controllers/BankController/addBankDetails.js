const { constants, statusCode, errorResponseFunc, successResponseFunc, models, logger } = require('../../utils/utilsIndex')


const addBankDetails = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            logger.warn(
                errorResponseFunc(
                    "There is no request body.",
                    "No request body.",
                    statusCode.badRequest,
                    constants.BADREQUEST
                )
            );
            return res.send(errorResponseFunc(
                "There is n request body",
                "No request body",
                statusCode.badRequest,
                constants.BADREQUEST
            ))

        }
        const employeeId = req.employeeId
        const { bankName, accountNo, IFSC, isActive, branchName} = req.body

        const employeeBank = await models.BankDetails.findOne({ where: { employeeId } })
        if (employeeBank) {
            await employeeBank.update(req.body)
            return res.send(
                successResponseFunc(
                    `Successfully updated bank`,
                    statusCode.success,
                    constants.SUCCESS
                )
            );
        }

        if (!bankName || !accountNo || !IFSC || !isActive) {
            logger.warn(
                errorResponseFunc(
                    "Please fill all the fields.",
                    "Empty fields.",
                    statusCode.badRequest,
                    constants.BADREQUEST
                )
            );
            return res.send(
                errorResponseFunc(
                    "Please fill all the fields.",
                    "Empty fields.",
                    statusCode.badRequest,
                    constants.BADREQUEST
                )
            );
        }
        const addBank = await models.BankDetails.create({
            employeeId,
            bankName,
            accountNo,
            IFSC,
            isActive,
            branchName
        })
        return res.send(
            successResponseFunc(
                `Bank added successfully.`,
                statusCode.created,
                constants.CREATED,
                addBank
            )
        );


    } catch (err) {
        logger.error(
            errorResponseFunc(
                "Error while adding bankDetails.",
                err.toString(),
                statusCode.internalServerError,
                constants.ERROR
            )
        );
        res.send(
            errorResponseFunc(
                "Error while adding bankDetails..",
                err.toString(),
                statusCode.internalServerError,
                constants.ERROR
            )
        );
    }
}


module.exports = addBankDetails