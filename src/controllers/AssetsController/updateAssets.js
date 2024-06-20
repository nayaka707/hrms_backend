const {
  statusCode,
  constants,
  Assets,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./assetsPackageCentral");

const updateAssets = async (req, res) => {
  try {
    const assetsId = req.query.assetsId;
    const employeeId = req.query.employeeId;
    const name = req.body.assetsName;
    const assignedDate = req.body.assignedDate;

    if (!assetsId) {
      logger.warn(
        errorResponseFunc(
          "Invalid Asset",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      return res.send(
        errorResponseFunc(
          "Invalid Asset",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    }

    const asset = await Assets.findOne({ assetsId: assetsId , employeeId: employeeId});
    if (!asset) {
      logger.warn(
        errorResponseFunc(
          "Asset not found",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      return res.send(
        errorResponseFunc(
          "Asset not found",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    } else {
      await Assets.update(
        { assetsName: name, assignedDate: assignedDate },
        { where: { assetsId: assetsId } }
      );
    }

    res.send(
      successResponseFunc(
        "Asset updated successfully",
        responseMessage.success,
        statusCode.success,
        constants.SUCCESS
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

module.exports = { updateAssets };
