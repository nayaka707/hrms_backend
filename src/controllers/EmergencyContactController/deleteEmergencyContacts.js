const {
    EmergencyContacts,
    statusCode,
    constants,
    responseMessage,
    errorResponseFunc,
    successResponseFunc,
    logger,
  } = require("./emergencyContactPackageCentral");
  
  const deleteEmergencyContacts = async (req, res) => {
    try {
      let EmployeeId =
        req.query.employeeId === ""
          ? req.loggersId
          : req.query.employeeId;
  
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
          const emergencyContacts = await EmergencyContacts.findOne({
            where: {
              employeeId: EmployeeId,
            },
          });
  
          if (!emergencyContacts) {
            logger.warn(
              errorResponseFunc(
                "This Emergency contacts dose not exist",
                responseMessage.notFound,
                statusCode.notFound,
                constants.NOTFOUND
              )
            );
            return res.send(
              errorResponseFunc(
                "This Emergency contacts dose not exist",
                responseMessage.notFound,
                statusCode.notFound,
                constants.NOTFOUND
              )
            );
          }
          await emergencyContacts.destroy();
  
          res.send(
            successResponseFunc(
              `Emergency contacts deleted successfully`,
              statusCode.success,
              constants.SUCCESS
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
  
  module.exports = { deleteEmergencyContacts };
  