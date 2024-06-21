const {
  Employees,
  Role,
  statusCode,
  constants,
  successResponseFunc,
  errorResponseFunc,
  unlinkFiles,
  logger,
} = require("./employeePackageCentral");

const logOut = async (req, res) => {
  try {
    let employee = await Employees.findOne({ id: req.employeeId });
    if (!employee) {
      return errorResponseFunc(
        "Invalid credencial",
        statusCode.notFound,
        constants.NOTFOUND
      );
    }else{
      await Employees.update(
        { sessionId: null },
        { where: { id: req.employeeId } }
      );
    }
    res.send(
      successResponseFunc(
        "logOut successfully.",
        statusCode.success,
        constants.SUCCESS
      )
    );
  } catch (err) {
    logger.error(
      errorResponseFunc(
        "Encountered error while syncing the employee table.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    res.send(
      errorResponseFunc(
        "Encountered error while syncing the employee table.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

module.exports = { logOut };
