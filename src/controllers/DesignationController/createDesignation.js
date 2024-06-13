const {
  Designation,
  Role,
  constants,
  responseMessage,
  statusCode,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./designationPackageCentral");

const createDesignation = async (req, res) => {
  try {
    const role = req.roleId;
    const designationName = req.body.designationName;

    const roleName = await Role.findOne({ where: { id: role } });
    if (roleName.name !== constants.ADMIN || roleName.name !== constants.HR) {
      logger.warn(
        errorResponseFunc(
          "Only Super Admin or HR can create Designation.",
          responseMessage.unauthorized,
          statusCode.unauthorized,
          constants.UNAUTHORIZED
        )
      );
      return res.send(
        errorResponseFunc(
          "Only Super Admin or HR can create Designation.",
          responseMessage.unauthorized,
          statusCode.unauthorized,
          constants.UNAUTHORIZED
        )
      );
    } else {
      await Designation.create({
        name: designationName,
        isActive: constants.ACTIVE,
      });
      res.send(
        successResponseFunc(
          "Designation created successfully.",
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

module.exports = createDesignation;
