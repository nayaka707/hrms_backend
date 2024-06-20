const {
  statusCode,
  constants,
  ExperienceDetails,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./experienceDetailsPackageCentral");

const addExperienceDetails = async (req, res) => {
  try {
    let EmployeeId =
      req.query.employeeId === "" ? req.loggersId : req.query.employeeId;
    if (!EmployeeId) {
      logger.warn(
        errorResponseFunc(
          "Invalid EmployeeId",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      return res.send(
        errorResponseFunc(
          "Invalid EmployeeId",
          responseMessage.notFound,
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    } else {
      let payload = req.body;
      for (const key in payload) {
        if (payload.hasOwnProperty(key)) {
          const experienceDetails = await ExperienceDetails.findOne({
            where: {
              employeeId: EmployeeId,
              experienceId: key,
            },
          });
          if (!experienceDetails) {
            const value = payload[key];
            await ExperienceDetails.create({
              companyName: value.companyName,
              designation: value.designation,
              location: value.location,
              periodFrom: value.periodFrom,
              periodTo: value.periodTo,
              employeeId: EmployeeId,
              isActive: constants.ACTIVE,
              experienceId: key,
            });
          } else {
            const value = payload[key];
            await ExperienceDetails.update(
              {
                companyName: value.companyName,
                designation: value.designation,
                location: value.location,
                periodFrom: value.periodFrom,
                periodTo: value.periodTo,
              },
              {
                where: { employeeId: EmployeeId, experienceId: key },
              }
            );
          }
        }
      }
      res.send(
        successResponseFunc(
          `Experience Details successfully`,
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

module.exports = { addExperienceDetails };
