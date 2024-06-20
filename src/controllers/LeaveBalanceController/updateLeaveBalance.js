const {
  statusCode,
  constants,
  LeaveBalance,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
  cron,
  moment,
  LeaveMaster,
  Employees,
} = require("./leaveBalancePackageCentral");
const timeZone = "Asia/Kolkata";

const task = cron.schedule(
  "0 0 * * *",
  async () => {
    const now = moment.tz(timeZone);
    const day = now.date();
    const month = now.month() + 1;

    console.log("now", now);
    console.log("day", day);
    console.log("month", month);

    if (
      day === 1 &&
      (month === 1 || month === 4 || month === 7 || month === 10) // 1st of January, April, July, October
    ) {
      
      let monthOfQuarter =
        month === 1
          ? ["January", "February", "March"]
          : month === 4
          ? ["April", "May", "June"]
          : month === 7
          ? ["July", "August", "September"]
          : month === 10
          ? ["October", "November", "December"]
          : [];

      const totalLeaves = await LeaveMaster.sum("leaves", {
        where: {
          month: {
            [Op.in]: monthOfQuarter,
          },
        },
      });

      console.log("Total Leaves:", totalLeaves);

      const totalEmployees = await Employees.findAll({
        where: {
          isProbationCompleted: true,
        },
        attributes: ["id"],
      });

      const totalEmployeeId = totalEmployees.map((data) => data.id);

      await LeaveBalance.update(
        { balance: totalLeaves },
        {
          where: {
            employeeId: {
              [Op.in]: totalEmployeeId,
            },
          },
        }
      );
    }
  },
  {
    scheduled: false,
    timezone: timeZone,
  }
);

// Start the task
task.start();

const updateLeaveBalance = async (req, res) => {
  try {
    const leaveBalanceId = req.params.leaveBalanceId;
    const balance = req.body.balance;

    const leaveBalance = await LeaveBalance.findByPk(leaveBalanceId);
    if (!leaveBalance) {
      logger.warn(
        errorResponseFunc(
          "Leave Balance not found.",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      return res.send(
        errorResponseFunc(
          "Leave Balance not found.",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    } else {
      if (balance === null) {
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
      await LeaveBalance.update(
        { balance: balance },
        { where: { id: leaveBalanceId } }
      );
      res.send(
        successResponseFunc(
          "Leave Balance updated successfully.",
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

module.exports = { updateLeaveBalance };
