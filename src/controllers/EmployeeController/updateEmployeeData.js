const {
  Employees,
  errorResponseFunc,
  statusCode,
  constants,
  successResponseFunc,
} = require("./employeePackageCentral");

const updateEmployeeData = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    if (!employeeId) {
      logger.error(
        errorResponseFunc(
          "employeeId not found.",
          err.toString(),
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      res.send(
        errorResponseFunc(
          "employeeId not found.",
          "employeeId not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    }

    const updateData = {
        currentAddress : req.body.currentAddress,
        permanentAddress : req.body.permanentAddress,
        pincode : req.body.pincode,
        city : req.body.city,
        state : req.body.state,
        dateOfBirth : req.body.dateOfBirth,
        qualification : req.body.qualification,
        nationality : req.body.nationality,
        passportNumber : req.body.passportNumber,
        fatherName : req.body.fatherName,
        motherName : req.body.motherName,
    };

    const employee = await Employees.findByPk(employeeId);
    if (!employee) {
        logger.error(
            errorResponseFunc(
              "employee not found.",
              err.toString(),
              statusCode.notFound,
              constants.NOTFOUND
            )
          );
          res.send(
            errorResponseFunc(
              "employee not found.",
              "employee not found.",
              statusCode.notFound,
              constants.NOTFOUND
            )
          );
    }

    await employee.update(updateData);
    return res.send(
      successResponseFunc(
        "Successfully updated employee details",
        statusCode.success,
        constants.SUCCESS
      )
    );
  } catch (err) {
    logger.error(
      errorResponseFunc(
        "Encountered error while updating personal details.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    res.send(
      errorResponseFunc(
        "Encountered error while updating personal details.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

module.exports = { updateEmployeeData };
