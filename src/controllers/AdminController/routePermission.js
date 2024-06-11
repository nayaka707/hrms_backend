const {
  logger,
  errorResponseFunc,
  successResponseFunc,
  statusCode,
  constants,
  Permission,
  Route,
} = require("./adminPackageCentral");

const routePermission = async (req, res) => {
  try {
    const routeId = req.params.routeId;
    const role = req.roleId;

    if (!routeId || !role) {
      logger.warn(
        errorResponseFunc(
          "Route or Role not found.",
          "Route or Role not found.",
          statusCode.unauthorized,
          constants.UNAUTHORIZED
        )
      );
      res.send(
        errorResponseFunc(
          "Route or Role not found.",
          "Route or Role not found.",
          statusCode.unauthorized,
          constants.UNAUTHORIZED
        )
      );
    } else {
      const permissionData = await Permission.findOne({
        where: { roleId: role, routeId: routeId },
        attributes: ["canCreate", "canRead", "canUpdate", "canDelete"],
        include : {
            model : Route,
            where : { isActive : "1" },
            attributes : ["id", ["name", "routeName"]]
        }
      });

      if(!permissionData) {
        logger.warn(
          errorResponseFunc(
            "Permission not found.",
            "Permission not found.",
            statusCode.unauthorized,
            constants.UNAUTHORIZED
          )
        );
        res.send(
          errorResponseFunc(
            "Permission not found.",
            "Permission not found.",
            statusCode.unauthorized,
            constants.UNAUTHORIZED
          )
        );
      } else {
        res.send(
          successResponseFunc(
            "Permission found.",
            statusCode.success,
            constants.SUCCESS,
            permissionData
          )
        );
      }
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

module.exports = routePermission;
