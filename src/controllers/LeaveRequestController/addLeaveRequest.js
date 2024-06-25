const {
  statusCode,
  constants,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
  LeaveRequest,
  LeaveBalance,
} = require("./leaveRequestPackageCentral");

const addLeaveRequest = async (req, res) => {
  try {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const halfLeaveDate = req.body.halfLeaveDate
      ? req.body.halfLeaveDate
      : null;
    const numberOfDays = req.body.numberOfDays;
    const reason = req.body.reason;
    const EmployeeId = req.loggersId;
    if (!startDate || !endDate || !numberOfDays || !reason || !EmployeeId) {
      logger.warn(
        errorResponseFunc(
          "There is no request body.",
          "No request body.",
          statusCode.badRequest,
          constants.BADREQUEST
        )
      );
      res.send(
        errorResponseFunc(
          "There is no request body.",
          "No request body.",
          statusCode.badRequest,
          constants.BADREQUEST
        )
      );
    } else {
      const leaveBalance = await LeaveBalance.findOne({
        where: {
          employeeId: EmployeeId,
        },
      });
      await LeaveRequest.create({
        startDate: startDate,
        endDate: endDate,
        balance: leaveBalance.balance,
        halfLeaveDate: halfLeaveDate,
        numberOfDays: numberOfDays,
        reason: reason,
        employeeId: EmployeeId,
        isActive: constants.ACTIVE,
      });

      res.send(
        successResponseFunc(
          "Leave Request created successfully.",
          statusCode.created,
          constants.CREATED
        )
      );
    }
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

module.exports = { addLeaveRequest };
