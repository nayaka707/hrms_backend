const {
  Route,
  constants,
  responseMessage,
  statusCode,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./routesPackageCentral");

const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send(
      successResponseFunc(
        "Here is the routes data.",
        statusCode.success,
        constants.SUCCESS,
        routes
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

module.exports = getAllRoutes;