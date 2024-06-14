const {
  EmergencyContacts,
  statusCode,
  constants,
  responseMessage,
  errorResponseFunc,
  successResponseFunc,
  logger,
} = require("./emergencyContactPackageCentral");

const addEmergencyContacts = async (req, res) => {
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
        primaryName: req.body.primaryName,
        primaryRelationship: req.body.primaryRelationship,
        primaryPhoneNo: req.body.primaryPhoneNo,
        primaryAddress: req.body.primaryAddress,
        secondaryName: req.body.secondaryName,
        secondRelationship: req.body.secondRelationship,
        secondaryPhoneNo: req.body.secondaryPhoneNo,
        secondaryAddress: req.body.secondaryAddress,
      };
      const emergencyContacts = await EmergencyContacts.findOne({
        where: {
          employeeId: EmployeeId,
        },
      });
      if (emergencyContacts) {
        await EmergencyContacts.update(
          {
            ...payload,
          },
          {
            where: { employeeId: EmployeeId },
          }
        );
        return res.send(
          successResponseFunc(
            `Emergency contacts update successfully`,
            statusCode.success,
            constants.SUCCESS
          )
        );
      }
      await EmergencyContacts.create({
        ...payload,
        employeeId: EmployeeId,
        isActive: "1",
      });
      return res.send(
        successResponseFunc(
          `Emergency contacts create successfully`,
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

module.exports = { addEmergencyContacts };
