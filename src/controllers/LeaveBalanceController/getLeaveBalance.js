const {
  statusCode,
  constants,
  LeaveBalance,
  errorResponseFunc,
  successResponseFunc,
  logger,
  Employees,
  Sequelize,
  Designation
} = require("./leaveBalancePackageCentral");

const getAllLeaveBalance = (req, res) => {
  try {
    Employees.findAll({
      include: [
        {
          model: LeaveBalance,
          attributes: []
        },
        {
          model: Designation,
          as: "designations",
          attributes: [],
        },
      ],
      attributes: [
        [Sequelize.col("leaveBalance.id"), "id"],
        [
          Sequelize.literal(
            'CONCAT("employees"."firstName", \' \',"employees"."lastName")'
          ),
          "fullName",
        ],
        [Sequelize.col("leaveBalance.balance"), "balance"],
        [Sequelize.col("leaveBalance.employeeId"), "employeeId"],
        [Sequelize.col("leaveBalance.paidLeave"), "paidLeave"],
        [Sequelize.col("leaveBalance.paidLeave"), "paidLeave"],
        [Sequelize.col("leaveBalance.lossOfPay"), "lossOfPay"],
        [Sequelize.col("designations.name"), "designation"],
      ],
    })
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
