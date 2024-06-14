const { statusCode, constants, EmployeeLogDetails, logger, successResponseFunc, errorResponseFunc } = require('./employeeLogPackageCentral')



const createEmployeeLogDetails = async (req, res) => {
    try {
        for (let row of req.body) {
            if (!row.employee_code || !row.log_date || !row.log_time || !row.direction) {
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
            await EmployeeLogDetails.create({
                employee_code: row.employee_code,
                log_date: row.log_date,
                log_time: row.log_time,
                direction: row.direction
            })
        }
        return res.send(
            successResponseFunc(
                `Successfully added employeLogDetails.`,
                statusCode.created,
                constants.CREATED,

            )
        );

    }
    catch (err) {
        console.log(err)
        logger.error(
            errorResponseFunc(
                "Error while adding employeLogDetails.",
                err.toString(),
                statusCode.internalServerError,
                constants.ERROR
            )
        );
        res.send(
            errorResponseFunc(
                "Error while adding employeLogDetails..",
                err.toString(),
                statusCode.internalServerError,
                constants.ERROR
            )
        );
    }

}



module.exports = { createEmployeeLogDetails } 