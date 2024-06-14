const {
  statusCode,
  constants,
  Assets,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./assetsPackageCentral");

const deleteAssets = async (req, res) => {
  try {
    let EmployeeId = req.loggersId;
    const assetsId = req.query.assetsId;

    if (!EmployeeId) {
      logger.warn(
        errorResponseFunc(
          "Invalid Employee",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      return res.send(
        errorResponseFunc(
          "Invalid Employee",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    } else {
      if (!assetsId) {
        logger.warn(
          errorResponseFunc(
            "Please add the assetsId fields.",
            "Please add the assetsId fields.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
        res.send(
          errorResponseFunc(
            "Please add the assetsId fields.",
            "Please add the assetsId fields.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
      } else {
        const assetsDetails = await Assets.findOne({
          where: {
            employeeId: EmployeeId,
            assetsId: assetsId,
          },
        });

        if (!assetsDetails) {
          logger.warn(
            errorResponseFunc(
              "This assets Details dose not exist",
              responseMessage.notFound,
              statusCode.notFound,
              constants.NOTFOUND
            )
          );
          return res.send(
            errorResponseFunc(
              "This assets Details dose not exist",
              responseMessage.notFound,
              statusCode.notFound,
              constants.NOTFOUND
            )
          );
        }

        await assetsDetails.destroy();
        res.send(
          successResponseFunc(
            `Assets Details deleted successfully`,
            statusCode.success,
            constants.SUCCESS
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

module.exports = { deleteAssets };
