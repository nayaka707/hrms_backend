const {
  statusCode,
  constants,
  Department,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./departmentPackageCentral");

const updateDepartment = async (req, res) => {
  try {
    const departmentId = req.params.departmentId;
    const departmentName = req.body.name;

    const departmentData = await Department.findByPk(departmentId);
    if (!departmentData) {
      logger.warn(
        errorResponseFunc(
          "Department not found.",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      return res.send(
        errorResponseFunc(
          "Department not found.",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    } else {
      await Department.update(
        { name: departmentName },
        { where: { id: departmentId } }
      );
      res.send(
        successResponseFunc(
          "Department updated successfully.",
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

module.exports = updateDepartment;