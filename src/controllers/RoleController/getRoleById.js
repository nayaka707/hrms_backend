const {
  Role,
  constants,
  statusCode,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./rolePackageCentral");

const getRoleById = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const role = await Role.findOne({
      where: { id: roleId },
      attributes: ["id", "name", "isActive"],
    });
    res.send(
      successResponseFunc(
        "Here is the role data.",
        statusCode.success,
        constants.SUCCESS,
        role
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

module.exports = getRoleById;
