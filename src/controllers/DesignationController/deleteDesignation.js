const {
  Designation,
  Role,
  Employees,
  constants,
  responseMessage,
  statusCode,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./designationPackageCentral");

const deleteDesignation = async (req, res) => {
  try {
    const role = req.roleId;
    const designationId = req.params.id;

    const roleName = await Role.findOne({ where: { id: role } });
    if (roleName.name !== constants.ADMIN || roleName.name !== constants.HR) {
      logger.warn(
        errorResponseFunc(
          "Only Super Admin or HR can delete Designation.",
          responseMessage.unauthorized,
          statusCode.unauthorized,
          constants.UNAUTHORIZED
        )
      );
      return res.send(
        errorResponseFunc(
          "Only Super Admin or HR can delete Designation.",
          responseMessage.unauthorized,
          statusCode.unauthorized,
          constants.UNAUTHORIZED
        )
      );
    }

    const designation = await Designation.findByPk(designationId);
    if (!designation) {
      logger.warn(
        errorResponseFunc(
          "Designation not found.",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      return res.send(
        errorResponseFunc(
          "Designation not found.",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    } else {
      await Employees.update(
        { designationId: null },
        { where: { designationId: designationId } }
      );
      await Designation.update(
        { isActive: constants.INACTIVE },
        { where: { id: designationId } }
      );
      logger.info(
        successResponseFunc(
          "Designation deleted successfully.",
          statusCode.success,
          constants.SUCCESS
        )
      );
      res.send(
        successResponseFunc(
          "Designation deleted successfully.",
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

module.exports = deleteDesignation;
