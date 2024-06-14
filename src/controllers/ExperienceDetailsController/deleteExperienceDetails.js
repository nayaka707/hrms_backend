const {
  statusCode,
  constants,
  ExperienceDetails,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./experienceDetailsPackageCentral");

const deleteExperienceDetails = async (req, res) => {
  try {
    let EmployeeId = req.loggersId;
    const ExperienceId = req.query.experienceId;

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
      if (!ExperienceId) {
        logger.warn(
          errorResponseFunc(
            "Please add the ExperienceId fields.",
            "Empty fields.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
        res.send(
          errorResponseFunc(
            "Please add the ExperienceId fields.",
            "Empty fields.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
      } else {
        const experienceDetails = await ExperienceDetails.findOne({
          where: {
            employeeId: EmployeeId,
            experienceId: ExperienceId,
          },
        });

        if (!experienceDetails) {
          logger.warn(
            errorResponseFunc(
              "This experience Details dose not exist",
              responseMessage.notFound,
              statusCode.notFound,
              constants.NOTFOUND
            )
          );
          return res.send(
            errorResponseFunc(
              "This experience Details dose not exist",
              responseMessage.notFound,
              statusCode.notFound,
              constants.NOTFOUND
            )
          );
        }
        await experienceDetails.destroy();

        res.send(
          successResponseFunc(
            `experience Details deleted successfully`,
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

module.exports = { deleteExperienceDetails };
