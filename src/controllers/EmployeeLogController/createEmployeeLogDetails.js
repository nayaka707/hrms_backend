const {
  statusCode,
  constants,
  EmployeeLogDetails,
  logger,
  successResponseFunc,
  errorResponseFunc,
} = require("./employeeLogPackageCentral");

const createEmployeeLogDetails = async (req, res) => {
  try {
    const body = req.body.map((el) => ({
      employee_code: el.EmployeeCode,
      log_date: el.LogDate,
      log_time: el.LogTime,
      direction: el.Direction,
    }));

    const existingRows = await EmployeeLogDetails.findAll({
      where: {
        employee_code: body.map((row) => row.employee_code),
        log_date: body.map((row) => row.log_date),
        log_time: body.map((row) => row.log_time),
        direction: body.map((row) => row.direction),
      },
      raw: true,
    });

    const existingKeys = new Set(
      existingRows.map(
        (row) =>
          `${row.employee_code}-${row.log_date}-${row.log_time}-${row.direction}`
      )
    );

    const newRows = body.filter(
      (row) =>
        !existingKeys.has(
          `${row.employee_code}-${row.log_date}-${row.log_time}-${row.direction}`
        )
    );

    if (newRows.length > 0) {
      await EmployeeLogDetails.bulkCreate(newRows);
      return res.send(
        successResponseFunc(
          `Successfully added ${newRows.length} employeeLogDetails.`,
          statusCode.created,
          constants.CREATED
        )
      );
    } else {
      return res.send(
        successResponseFunc(
          "No new data to insert.",
          statusCode.noContent,
          constants.NOCONTENT
        )
      );
    }
  } catch (err) {
    logger.error(
      errorResponseFunc(
        "Error while adding employeeLogDetails.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    return res.send(
      errorResponseFunc(
        "Error while adding employeeLogDetails.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

module.exports = { createEmployeeLogDetails };
