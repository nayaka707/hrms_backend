const {
  statusCode,
  constants,
  LeaveRequest,
  errorResponseFunc,
  successResponseFunc,
  Employees,
  logger,
  Sequelize,
  Op,
  LeaveBalance,
} = require("./leaveRequestPackageCentral");

const getAllLeaveRequest = (req, res) => {
  try {
    let search = req.query.search;
    let status = req.query.status;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let limit = req.query.limit ? req.query.limit : 10;
    let offset = req.query.offset ? req.query.offset : 0;

    Employees.findAndCountAll({
      attributes: [
        "id",
        [
          Sequelize.literal(
            'CONCAT("employees"."firstName", \' \',"employees"."lastName")'
          ),
          "fullName",
        ],
      ],
      include: {
        model: LeaveRequest,
        attributes: {
          exclude: ["balance", "isActive", "updatedAt"],
        },
        where: {
          ...(status && { status: status }),
          ...(startDate && endDate && startDate === endDate
            ? {
                startDate: {
                  [Op.lte]: startDate,
                },
                endDate: {
                  [Op.gte]: endDate,
                },
              }
            : {
                ...(startDate && {
                  startDate: {
                    [Op.gte]: startDate,
                  },
                }),
                ...(endDate && {
                  endDate: {
                    [Op.lte]: endDate,
                  },
                }),
              }),
        },
        include: [
          {
            model: Employees,
            as: "approver",
            attributes: [
              [
                Sequelize.literal('CONCAT("firstName", \' \',"lastName")'),
                "approverFullName",
              ],
            ],
          },
        ],
      },
      order: [[LeaveRequest, "createdAt", "DESC"]],
      where: Sequelize.where(
        Sequelize.fn(
          "LOWER",
          Sequelize.literal(
            'CONCAT("employees"."firstName", \' \',"employees"."lastName")'
          )
        ),
        {
          [Op.like]: "%" + search.toLowerCase() + "%",
        }
      ),
      limit: limit,
      offset: offset,
    })
      .then(async (result) => {
        let date = new Date();
        let leaveRequestData = await LeaveRequest.findAll({
          where: {
            status: constants.APPROVED,
            startDate: {
              [Op.lte]: date,
            },
            endDate: {
              [Op.gte]: date,
            },
          },
          attributes: ["employeeId"],
        });
        let totalPendingLeaves = await LeaveRequest.count({
          where: {
            status: constants.PENDING,
          },
        });
        let uniqueEmployeeIds = [
          ...new Set(leaveRequestData.map((leave) => leave.employeeId)),
        ];
        let todayPresents = await Employees.count({
          where: {
            id: {
              [Op.notIn]: uniqueEmployeeIds,
            },
          },
        });
        let totalEmployees = await Employees.count();
        let data = {
          todayPresents: `${totalEmployees}/${todayPresents}`,
          totalPendingLeaves: totalPendingLeaves,
          count: result.count,
          rows: result.rows
            .map((employee) => {
              return employee.leaveRequests.map((leave) => ({
                id: leave.id,
                fullName: employee.dataValues.fullName,
                startDate: leave.startDate,
                endDate: leave.endDate,
                halfLeaveDate: leave.halfLeaveDate,
                numberOfDays: leave.numberOfDays,
                reason: leave.reason,
                status: leave.status,
                ...(leave.status === constants.REJECTED && {
                  remark: leave.remark,
                }),
                employeeId: leave.employeeId,
                approvedBy:
                  leave?.dataValues?.approver?.dataValues?.approverFullName ||
                  null,
              }));
            })
            .flat(),
        };
        res
          .status(statusCode.success)
          .send(
            successResponseFunc(
              "Here is the Leave Request's data.",
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

const getByIdLeaveRequest = async (req, res) => {
  try {
    let employeeId = req.loggersId;
    let limit = req.query.limit ? req.query.limit : 10;
    let offset = req.query.offset ? req.query.offset : 0;
    LeaveRequest.findAndCountAll({
      where: {
        employeeId: employeeId,
      },
      include: [
        {
          model: Employees,
          as: "approver",
          attributes: [],
        },
      ],
      attributes: [
        "id",
        "startDate",
        "endDate",
        "halfLeaveDate",
        "numberOfDays",
        "reason",
        "status",
        "remark",
        "employeeId",
        [
          Sequelize.literal(
            'CONCAT("approver"."firstName", \' \', "approver"."lastName")'
          ),
          "approverFullName",
        ],
      ],
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    })
      .then(async (leaveRequest) => {
        let leaveBalance = await LeaveBalance.findOne({
          where: {
            employeeId: employeeId,
          },
          attributes: {
            exclude: ["isActive", "createdAt", "updatedAt"],
          },
        });

        let data = {
          count:leaveRequest.count,
          rows: leaveRequest.rows
            .map((data) => {
              return {
                id: data.id,
                startDate: data.startDate,
                endDate: data.endDate,
                halfLeaveDate: data.halfLeaveDate,
                numberOfDays: data.numberOfDays,
                reason: data.reason,
                status: data.status,
                ...(data.status === constants.REJECTED && {
                  remark: data.remark,
                }),
                employeeId: data.employeeId,
                approvedBy: data?.dataValues?.approverFullName || null
              };
            })
            .flat(),
          leaveDashboard: leaveBalance,
        };
        res.send(
          successResponseFunc(
            "Here is the Leave Request's data.",
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
  getAllLeaveRequest,
  getByIdLeaveRequest,
};
