const {
  statusCode,
  constants,
  Department,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./departmentPackageCentral");

const deleteDepartment = async (req, res) => {
  try {
    const departmentId = req.params.id;

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
        { isActive: constants.INACTIVE },
        { where: { id: departmentId } }
      );

      res.send(
        successResponseFunc(
          "Department deleted successfully.",
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

module.exports = deleteDepartment ;