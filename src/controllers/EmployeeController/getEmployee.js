const {
  Employees,
  statusCode,
  constants,
  errorResponseFunc,
  successResponseFunc,
  bcrypt,
  logger,
} = require("./employeePackageCentral");

const getAllEmployeesData = (req, res) => {
  try {
    Employees.findAll({})
      .then((data) => {
        res.send(
            successResponseFunc(
              "Here is the Employee's data.",
              statusCode.success,
              constants.SUCCESS,
              data
            )
          );
      })
      .catch((err) => {
        console.log("err",err);
        logger.error(
          errorResponseFunc(
            "Encountered error after checking if this exists.",
            err.toString(),
            statusCode.internalServerError,
            constants.ERROR
          )
        );
        res.send(
          errorResponseFunc(
            "Encountered error after checking if this exists.",
            err.toString(),
            statusCode.internalServerError,
            constants.ERROR
          )
        );
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

module.exports = {
  getAllEmployeesData,
};
