const {
  Employees,
  Role,
  statusCode,
  constants,
  successResponseFunc,
  errorResponseFunc,
  unlinkFiles,
  logger,
} = require("./adminPackageCentral.js");
const { adminCreatorFunc } = require("./adminUtils.js");
const addAdmin = (req, res) => {
  try {
    logger.info("/addSuperAdmin route accessed.");
    const { files = [] } = req;
    console.log("addAdmin files ::", files);
    if (Object.keys(req.body).length === 0) {
      unlinkFiles(req.files);
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
      const {
        firstName,
        email,
        middleName = req.body.firstName,
        lastName,
        dateOfJoining,
        phoneNumber,
        departmentId,
        designationId,
        pancardNo,
        aadharNo,
        uanNo,
        workLocation,
        pfNo,
        gender,
        roleId,
        currentAddress,
        permanentAddress,
        reportTo,
      } = req.body;
      let profilePicture = null;
      if (files.length > 0) {
        const file = files[0];
        profilePicture = file.filename;
      }
      if (
        !firstName ||
        !middleName ||
        !lastName ||
        !email ||
        !dateOfJoining ||
        !phoneNumber ||
        !departmentId ||
        !designationId ||
        !pancardNo ||
        !aadharNo ||
        !uanNo ||
        !workLocation ||
        !pfNo ||
        !gender ||
        !roleId ||
        !currentAddress ||
        !permanentAddress ||
        !reportTo
      ) {
        unlinkFiles(req.files);
        logger.warn(
          errorResponseFunc(
            "Please fill all the fields.",
            "Empty fields.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
        res.send(
          errorResponseFunc(
            "Please fill all the fields.",
            "Empty fields.",
            statusCode.badRequest,
            constants.BADREQUEST
          )
        );
      } else {
        Employees.findOne({
          where: {
            email: email.toLowerCase(),
            isActive: constants.ACTIVE,
          },
        })
          .then((data) => {
            if (!data) {
              Role.findOne({
                where: {
                  id: roleId,
                  isActive: constants.ACTIVE,
                },
              })
                .then(async (data) => {
                  try {
                    if (data) {
                      const adminDetails = {
                        email: email,
                        roleId: data.id,
                        isActive: constants.ACTIVE,
                        firstName: firstName,
                        middleName: middleName,
                        lastName: lastName,
                        dateOfJoining: dateOfJoining,
                        phoneNumber: phoneNumber,
                        departmentId: departmentId,
                        designationId: designationId,
                        pancardNo: pancardNo,
                        aadharNo: aadharNo,
                        uanNo: uanNo,
                        workLocation: workLocation,
                        pfNo: pfNo,
                        gender: gender,
                        currentAddress: currentAddress,
                        permanentAddress: permanentAddress,
                        reportTo: reportTo,
                        profilePicture: profilePicture,
                      };

                      await adminCreatorFunc(adminDetails);

                      res.send(
                        successResponseFunc(
                          `Created successfully.`,
                          statusCode.created,
                          constants.CREATED
                        )
                      );
                    } else {
                      unlinkFiles(req.files);
                      logger.warn(
                        errorResponseFunc(
                          "Role not found.",
                          "Role not found.",
                          statusCode.notFound,
                          constants.NOTFOUND
                        )
                      );
                      res.send(
                        errorResponseFunc(
                          "Role not found.",
                          "Role not found.",
                          statusCode.notFound,
                          constants.NOTFOUND
                        )
                      );
                    }
                  } catch (err) {
                    unlinkFiles(req.files);
                    logger.error(
                      errorResponseFunc(
                        "Encountered error while creating the admin.",
                        err.toString(),
                        statusCode.internalServerError,
                        constants.ERROR
                      )
                    );
                    res.send(
                      errorResponseFunc(
                        "Encountered error while creating the admin.",
                        err.toString(),
                        statusCode.internalServerError,
                        constants.ERROR
                      )
                    );
                  }
                })
                .catch((err) => {
                  unlinkFiles(req.files);
                  logger.error(
                    errorResponseFunc(
                      "Encountered error while checking if this role exists.",
                      err.toString(),
                      statusCode.internalServerError,
                      constants.ERROR
                    )
                  );
                  message = res.send(
                    errorResponseFunc(
                      "Encountered error while checking if this role exists.",
                      err.toString(),
                      statusCode.internalServerError,
                      constants.ERROR
                    )
                  );
                });
            } else {
              unlinkFiles(req.files);
              logger.error(
                errorResponseFunc(
                  "Admin with this email already exists.",
                  "Already exists.",
                  statusCode.conflict,
                  constants.CONFLICT
                )
              );
              res.send(
                errorResponseFunc(
                  "Admin with this email already exists.",
                  "Already exists.",
                  statusCode.conflict,
                  constants.CONFLICT
                )
              );
            }
          })
          .catch((err) => {
            unlinkFiles(req.files);
            logger.error(
              errorResponseFunc(
                "Encountered error after checking if this admin exists.",
                err.toString(),
                statusCode.internalServerError,
                constants.ERROR
              )
            );
            res.send(
              errorResponseFunc(
                "Encountered error after checking if this admin exists.",
                err.toString(),
                statusCode.internalServerError,
                constants.ERROR
              )
            );
          });
      }
    }
  } catch (err) {
    unlinkFiles(req.files);
    logger.error(
      errorResponseFunc(
        "Encountered error while syncing the admin table.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    res.send(
      errorResponseFunc(
        "Encountered error while syncing the admin table.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

module.exports = addAdmin;