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

const updateDesignation = async (req, res) => {
  try {
    const role = req.roleId;
    const designationId = req.params.id;
    const designationName = req.body.name;

    const roleName = await Role.findOne({ where: { id: role } });
    if (roleName.name !== constants.ADMIN || roleName.name !== constants.HR) {
      logger.warn(
        errorResponseFunc(
          "Only Super Admin or HR can update Designation.",
          responseMessage.unauthorized,
          statusCode.unauthorized,
          constants.UNAUTHORIZED
        )
      );
      return res.send(
        errorResponseFunc(
          "Only Super Admin or HR can update Designation.",
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
      await Designation.update(
        { name: designationName },
        { where: { id: designationId } }
      );

      return res.send(
        successResponseFunc(
          "Designation updated successfully.",
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

module.exports = updateDesignation;
