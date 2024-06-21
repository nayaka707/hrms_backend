const {
  statusCode,
  constants,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
  LeaveMaster,
} = require("./leaveMasterPackageCentral");

const addLeaveMaster = async (req, res) => {
  try {
    const month = req.body.month;
    const leaves = req.body.leaves;

    if (!month || !leaves) {
      logger.warn(
        errorResponseFunc(
          "There is no request body.",
          "No request body.",
          statusCode.badRequest,
          constants.BADREQUEST
        )
      );
      res.send(
        errorResponseFunc(
          "There is no request body.",
          "No request body.",
          statusCode.badRequest,
          constants.BADREQUEST
        )
      );
    } else {
      const leaveMaster = await LeaveMaster.findOne({
        where: { month: month },
      });
      if (leaveMaster) {
        logger.warn(
          errorResponseFunc(
            "Month already exists.",
            responseMessage.exists,
            statusCode.conflict,
            constants.CONFLICT
          )
        );
        return res.send(
          errorResponseFunc(
            "Month already exists.",
            responseMessage.exists,
            statusCode.conflict,
            constants.CONFLICT
          )
        );
      }

      await LeaveMaster.create({
        month: month,
        leaves: leaves,
        isActive: constants.ACTIVE,
      });
      res.send(
        successResponseFunc(
          "Leave Master created successfully.",
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

module.exports = { addLeaveMaster };
