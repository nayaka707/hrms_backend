const {
  statusCode,
  constants,
  LeaveRequest,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
  Employees,
  LeaveBalance,
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

    const leaveRequest = await LeaveRequest.findByPk(leaveRequestId);
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

const updateLeaveRequestStatus = async (req, res) => {
  try {
    const approvedBy = req.loggersId;
    const leaveRequestId = req.params.leaveRequestId;
    const status = req.body.status;
    const remark = req.body.remark;

    const leaveRequest = await LeaveRequest.findByPk(leaveRequestId);
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
      if (!status) {
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
      // const employee = await Employees.findOne({
      //   where: {
      //     id: leaveRequest.employeeId,
      //   },
      // });
      const leaveBalance = await LeaveBalance.findOne({
        where: {
          employeeId: leaveRequest.employeeId,
        },
      });
      if (status === constants.APPROVED) {
        if (leaveBalance.balance >= leaveRequest.numberOfDays) {
          let leave = leaveBalance.balance - leaveRequest.numberOfDays;
          let paidLeave = leaveBalance.paidLeave + leaveRequest.numberOfDays;
          await LeaveBalance.update(
            {
              balance: leave,
              paidLeave: paidLeave,
            },
            { where: { employeeId: leaveRequest.employeeId } }
          );
        } else {
          let leaveDaysExceedingBalance =
            leaveRequest.numberOfDays - leaveBalance.balance;
          let paidLeave = leaveBalance.paidLeave + leaveBalance.balance;
          let lossOfpay = leaveDaysExceedingBalance;
          await LeaveBalance.update(
            {
              balance: 0,
              paidLeave: paidLeave,
              lossOfPay: leaveBalance.lossOfPay + lossOfpay,
            },
            { where: { employeeId: leaveRequest.employeeId } }
          );
        }
      } else if (status === constants.CANCELLED) {
        if (leaveRequest.balance >= leaveRequest.numberOfDays) {
          let leave = leaveBalance.balance + leaveRequest.numberOfDays;
          let paidLeave = leaveBalance.paidLeave - leaveRequest.numberOfDays;

          await LeaveBalance.update(
            {
              balance: leave,
              paidLeave: paidLeave,
            },
            { where: { employeeId: leaveRequest.employeeId } }
          );
        } else {
          let balance = leaveBalance.balance + leaveRequest.balance;
          let leaveDaysExceedingBalance =
            leaveRequest.numberOfDays - leaveRequest.balance;
          let paidLeave = leaveBalance.paidLeave - leaveRequest.balance;
          let lossOfpay = leaveDaysExceedingBalance;


          await LeaveBalance.update(
            {
              balance: balance,
              paidLeave: paidLeave,
              lossOfPay: leaveBalance.lossOfPay - lossOfpay,
            },
            { where: { employeeId: leaveRequest.employeeId } }
          );
        }
      }

      await LeaveRequest.update(
        {
          approvedBy: approvedBy,
          status: status,
          ...(remark && { remark: remark }),
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

module.exports = { updateLeaveRequest, updateLeaveRequestStatus };
