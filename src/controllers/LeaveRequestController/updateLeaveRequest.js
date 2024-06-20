const {
  statusCode,
  constants,
  LeaveRequest,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./leaveRequestPackageCentral");

const updateLeaveRequest = async (req, res) => {
  try {
    const leaveRequestId = req.params.leaveRequestId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const halfLeaveDate = req.body.halfLeaveDate
      ? req.body.halfLeaveDate
      : null;
    const numberOfDays = req.body.numberOfDays;
    const reason = req.body.reason;

    const leaveRequest = await LeaveRequest.findByPk(leaveMasterId);
    if (!leaveRequest) {
      logger.warn(
        errorResponseFunc(
          "Leave request not found.",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      return res.send(
        errorResponseFunc(
          "Leave request not found.",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    } else {
      if (!startDate || !endDate || !numberOfDays || !reason) {
        logger.warn(
          errorResponseFunc(
            "There is no request body.",
            "No request body.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
        return res.send(
          errorResponseFunc(
            "There is no request body.",
            "No request body.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
      }
      await LeaveRequest.update(
        {
          startDate: startDate,
          endDate: endDate,
          halfLeaveDate: halfLeaveDate,
          numberOfDays: numberOfDays,
          reason: reason,
        },
        { where: { id: leaveRequestId } }
      );
      res.send(
        successResponseFunc(
          "Leave request updated successfully.",
          responseMessage.success,
          statusCode.success,
          constants.SUCCESS
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

module.exports = { updateLeaveRequest };
