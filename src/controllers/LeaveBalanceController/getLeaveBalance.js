const {
  statusCode,
  constants,
  LeaveBalance,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./leaveBalancePackageCentral");

const getAllLeaveBalance = (req, res) => {
  try {
    LeaveBalance.findAll({})
      .then((data) => {
        res.send(
          successResponseFunc(
            "Here is the Leave Balance's data.",
            statusCode.success,
            constants.SUCCESS,
            data
          )
        );
      })
      .catch((err) => {
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
  getAllLeaveBalance,
};
