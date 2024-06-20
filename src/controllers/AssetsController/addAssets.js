const {
  statusCode,
  constants,
  Assets,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
  temporaryPasswordString,
  unlinkFiles,
} = require("./assetsPackageCentral");

const addAssets = async (req, res) => {
  try {
    let EmployeeId =
      req.query.employeeId === "" ? req.loggersId : req.query.employeeId;
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
      let payload = {
        assetsName: req.body.assetsName,
        assetsId: temporaryPasswordString(),
        assignedDate: req.body.assignedDate,
        employeeId: EmployeeId,
        isActive: constants.ACTIVE,
      };
      if (
        !payload.assetsId ||
        !payload.assetsName ||
        !payload.assignedDate
      ) {
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
        await Assets.create({ ...payload });
        res.send(
          successResponseFunc(
            `Experience Details successfully`,
            statusCode.created,
            constants.CREATED
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

module.exports = { addAssets };
