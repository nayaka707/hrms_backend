const {
  statusCode,
  constants,
  Department,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./departmentPackageCentral");

const createDepartment = async (req, res) => {
  try {
    const dpName = req.body.name;

    const [department, created] = await Department.findOrCreate({
      where: { name: dpName },
      defaults: { name: dpName, isActive: constants.ACTIVE },
    });

    if (!created) {
      logger.warn(
        errorResponseFunc(
          "Department already exists.",
          responseMessage.exists,
          statusCode.conflict,
          constants.CONFLICT
        )
      );
      return res.send(
        errorResponseFunc(
          "Department already exists.",
          responseMessage.exists,
          statusCode.conflict,
          constants.CONFLICT
        )
      );
    } else {
      res.send(
        successResponseFunc(
          "Department created successfully.",
          statusCode.created,
          constants.CREATED
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

module.exports = createDepartment;