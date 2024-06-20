const {
  statusCode,
  constants,
  LeaveRequest,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./leaveRequestPackageCentral");

const deleteLeaveRequest = async (req, res) => {
  try {
    let EmployeeId = req.loggersId;
    const leaveRequestId = req.params.leaveRequestId;

    if (!EmployeeId) {
      logger.warn(
        errorResponseFunc(
          "Invalid Employee",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      return res.send(
        errorResponseFunc(
          "Invalid Employee",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    } else {
      if (!leaveRequestId) {
        logger.warn(
          errorResponseFunc(
            "Please add the leaveRequest Id fields.",
            "Empty fields.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
        res.send(
          errorResponseFunc(
            "Please add the leaveRequest Id fields.",
            "Empty fields.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
      } else {
        const leaveRequest = await LeaveRequest.findOne({
          where: {
            id: leaveRequestId,
            employeeId: EmployeeId,
          },
        });

        if (!leaveRequest) {
          logger.warn(
            errorResponseFunc(
              "This leave request dose not exist",
              responseMessage.notFound,
              statusCode.notFound,
              constants.NOTFOUND
            )
          );
          return res.send(
            errorResponseFunc(
              "This leave request dose not exist",
              responseMessage.notFound,
              statusCode.notFound,
              constants.NOTFOUND
            )
          );
        }

        await leaveRequest.destroy();
        res.send(
          successResponseFunc(
            `leave request deleted successfully`,
            statusCode.success,
            constants.SUCCESS
          )
        );
      }
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

module.exports = { deleteLeaveRequest };
