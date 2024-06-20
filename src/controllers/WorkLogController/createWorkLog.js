const {
  WorkLogs,
  constants,
  statusCode,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./workLogPackageCentral");

const createWorkLog = async (req, res) => {
  try {
    const employeeId = req.loggersId;
    for (let row of req.body) {
      if (!row.date || !row.workHour || !row.description || !row.projectId) {
        return res.send(
          errorResponseFunc(
            "Please fill all the fields.",
            "Empty fields.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
      }
      await WorkLogs.create({
        date: row.date,
        projectId: row.projectId,
        workHour: row.workHour,
        description: row.description,
        employeeId: employeeId,
      });
    }

    return res.send(
      successResponseFunc(
        `Successfully added WorkLog.`,
        statusCode.created,
        constants.CREATED
      )
    );
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

module.exports = createWorkLog;
