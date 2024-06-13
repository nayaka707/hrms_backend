const {
  Role,
  Permission,
  constants,
  statusCode,
  errorResponseFunc,
  successResponseFunc,
  responseMessage,
  logger,
} = require("./rolePackageCentral");

const createRole = async (req, res) => {
  try {
    const roleName = req.body.name;
    const permissions = req.body.permissions;
    const isActive = constants.ACTIVE;

    const [newRole, created] = await Role.findOrCreate({
      where: { name: roleName },
      defaults: { name: roleName, isActive },
    });

    if (!created) {
      logger.warn(
        errorResponseFunc(
          "Role already exists.",
          responseMessage.exists,
          statusCode.conflict,
          constants.CONFLICT
        )
      );
      return res.send(
        errorResponseFunc(
          "Role already exists.",
          responseMessage.exists,
          statusCode.conflict,
          constants.CONFLICT
        )
      );
    }

    const permissionData = permissions.map((permission) => ({
      roleId: newRole.id,
      routeId: permission.routeId,
      canCreate: permission.canCreate,
      canRead: permission.canRead,
      canUpdate: permission.canUpdate,
      canDelete: permission.canDelete,
    }));

    if (permissionData.length === 0) {
      logger.warn(
        errorResponseFunc(
          "No valid permissions provided.",
          responseMessage.notExist,
          statusCode.conflict,
          constants.CONFLICT
        )
      );
      return res.send(
        errorResponseFunc(
          "No valid permissions provided.",
          responseMessage.notExist,
          statusCode.conflict,
          constants.CONFLICT
        )
      );
    }

    const createdPermission = await Permission.bulkCreate(permissionData);
    res.send(
      successResponseFunc(
        "Role created successfully.",
        statusCode.success,
        constants.SUCCESS,
        createdPermission
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

module.exports = createRole;
