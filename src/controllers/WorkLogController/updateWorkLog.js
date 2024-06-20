const {
  WorkLogs,
  constants,
  statusCode,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./workLogPackageCentral");

const updateWorkLog = async (req, res) => {
  try {
    const workLogsArray = req.body;
    if (!Array.isArray(workLogsArray) || workLogsArray.length === 0) {
      return res.send(
        errorResponseFunc(
          "No work logs found in the request body.",
          "No work logs found in the request body.",
          statusCode.badRequest,
          constants.BADREQUEST
        )
      );
    }

    for (const workLogData of workLogsArray) {
      const { id, date, projectId, workHour, description } = workLogData;

      if (!id) {
        return res.status(statusCode.notFound).send(
          errorResponseFunc(
            "Worklog id not found for one of the items.",
            "Worklog id not found for one of the items.",
            statusCode.notFound,
            constants.NOTFOUND
          )
        );
      }

      const workLog = await WorkLogs.findOne({
        where: {
          id: id,
        },
      });

      if (workLog) {
        await WorkLogs.update(
          {
            date: date,
            projectId: projectId,
            workHour: workHour,
            description: description,
          },
          {
            where: {
              id: id,
            },
          }
        );
      } else {
        await WorkLogs.create({
          date: date,
          projectId: projectId,
          workHour: workHour,
          description: description,
        });
      }
    }

    return res.send(
      successResponseFunc(
        "Work logs updated successfully.",
        "Work logs updated successfully.",
        statusCode.success,
        constants.SUCCESS
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

module.exports = updateWorkLog;
