const {
  Admin,
  Role,
  statusCode,
  constants,
  successResponseFunc,
  errorResponseFunc,
  logger,
} = require("./adminPeckageCentral.js");
const { adminCreatorFunc } = require("./adminUtils.js");
const addAdmin = (req, res) => {
  try {
    console.log("req.body ::",req.body);
    logger.info("/addSuperAdmin route accessed.");
    if (Object.keys(req.body).length === 0) {
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
      const firstName = req.body.firstName;
      const email = req.body.email;
      const middleName = req.body.firstName;
      const lastName = req.body.lastName;
      const dateOfJoining = req.body.JoiningDate;
      const phoneNumber = req.body.phoneNo;
      const departmentId = req.body.department;
      const designationId = req.body.designation;
      const pancardNo = req.body.pancardNo;
      const aadharNo = req.body.aadharNo;
      const uanNo = req.body.uanNo;
      const workLocation = req.body.workLocation;
      const pfNo = req.body.pfNo;
      const gender = req.body.gender;
      const roleId = req.body.role;
      const currentAddress = req.body.currentAddress;
      const permanentAddress = req.body.permanentAddress;
      const reportTo = req.body.reportingPerson;
      // const  ...(files[0]?.filename && { profilePicture: files[0]?.filename }),

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
        Admin.findOne({
          where: {
            email: email.toLowerCase(),
            isActive: constants.ACTIVE,
          },
        })
          .then((data) => {
            if (!data) {
              Role.findOne({
                where: {
                  name: roleName.toUpperCase(),
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
