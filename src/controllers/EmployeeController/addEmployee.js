const {
  Employees,
  Role,
  statusCode,
  constants,
  successResponseFunc,
  errorResponseFunc,
  unlinkFiles,
  logger,
} = require("./employeePackageCentral");
const { employeeCreatorFunc } = require("./employeeUtils");
const addEmployee = (req, res) => {
  try {
    logger.info("/addEmployee route accessed.");
    const { files = [] } = req;
    if (Object.keys(req.body).length === 0) {
      unlinkFiles(files);
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
        middleName,
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
        reportTo,
      } = req.body;
      const authRoleId = req.roleId;
      let profilePicture = null;
      if (files.length > 0) {
        const file = files[0];
        profilePicture = file.filename;
      }
      if (
        !firstName ||
        !lastName ||
        !email ||
        !dateOfJoining ||
        !phoneNumber ||
        !departmentId ||
        !designationId ||
        !pancardNo ||
        !aadharNo ||
        !workLocation ||
        !gender ||
        !roleId ||
        !reportTo
      ) {
        unlinkFiles(files);
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
                    Role.findOne({
                      where: {
                        id: authRoleId,
                        isActive: constants.ACTIVE,
                      },
                    }).then(async (authRoleData) => {
                      if (
                        (authRoleData.name === "HR" &&
                          data.name === "SUPER ADMIN") ||
                        authRoleData.name === "EMPLOYEE"
                      ) {
                        res
                          .status(statusCode.badRequest)
                          .send(
                            errorResponseFunc(
                              "You dont have permission!",
                              "Account creation error.",
                              statusCode.badRequest,
                              constants.BADREQUEST
                            )
                          );
                      } else {
                        if (data) {
                          const lastEmployee = await Employees.findOne({
                            order: [['createdAt', 'DESC']]
                          });

                          let employeeCode = 'Px001';
                          if (lastEmployee && lastEmployee.employee_code) {
                            const lastCode = lastEmployee.employee_code;
                            const codeNumber = parseInt(lastCode.slice(2), 10) + 1;
                            employeeCode = `Px${codeNumber.toString().padStart(3, '0')}`;
                          }
                  

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
                            reportTo: reportTo,
                            profilePicture: profilePicture,
                            employee_code: employeeCode
                          };

                          await employeeCreatorFunc(adminDetails, req.files);

                          res.send(
                            successResponseFunc(
                              `Created successfully.`,
                              statusCode.created,
                              constants.CREATED
                            )
                          );
                        } else {
                          unlinkFiles(files);
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
                      }
                    });
                  } catch (err) {
                    unlinkFiles(files);
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
                  unlinkFiles(files);
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
              unlinkFiles(files);
              logger.error(
                errorResponseFunc(
                  "Email already exists.",
                  "Already exists.",
                  statusCode.conflict,
                  constants.CONFLICT
                )
              );
              res.send(
                errorResponseFunc(
                  "Email already exists.",
                  "Already exists.",
                  statusCode.conflict,
                  constants.CONFLICT
                )
              );
            }
          })
          .catch((err) => {
            unlinkFiles(files);
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
    unlinkFiles(files);
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

module.exports = { addEmployee };
