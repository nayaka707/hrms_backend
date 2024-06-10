const {
  Employees,
  statusCode,
  constants,
  errorResponseFunc,
  successResponseFunc,
  bcrypt,
  logger,
  sendEmail
} = require("./employeePackageCentral");

const resetPassword = (req, res) => {
  try {
    logger.info("/resetPassword route accessed.");

    const userId = req.loggersId;
    const currentPassword = req.body.currentPassword;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (!password || !confirmPassword || !currentPassword) {
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
          id: userId,
          isActive: constants.ACTIVE,
        },
      })
        .then(async (data) => {
          let capUserData = data;
          if (data) {
            if (capUserData.permanentPasswordSet === "0") {
              const passwordIsValid = bcrypt.compareSync(
                currentPassword,
                capUserData.temporaryPassword
              );

              if (!passwordIsValid) {
                logger.warn(
                  errorResponseFunc(
                    "The password is incorrect.",
                    "Incorrect password.",
                    statusCode.unauthorized,
                    constants.UNAUTHORIZED
                  )
                );
                res.send(
                  errorResponseFunc(
                    "The password is incorrect.",
                    "Incorrect password.",
                    statusCode.unauthorized,
                    constants.UNAUTHORIZED
                  )
                );
              } else {
                if (password !== confirmPassword) {
                  logger.warn(
                    errorResponseFunc(
                      "Both passwords does not match.",
                      "Passwords does not match.",
                      statusCode.badRequest,
                      constants.BADREQUEST
                    )
                  );
                  res.send(
                    errorResponseFunc(
                      "Both passwords does not match.",
                      "Passwords does not match.",
                      statusCode.badRequest,
                      constants.BADREQUEST
                    )
                  );
                } else {
                  const dataToUpdate = {
                    permanentPasswordSet: "1",
                    password: password,
                  };
                  await Employees.update(dataToUpdate, {
                    where: {
                      id: userId,
                    },
                  })
                    .then((data) => {
                      res.send(
                        successResponseFunc(
                          "Updated successfully.",
                          statusCode.success,
                          constants.SUCCESS
                        )
                      );
                    })
                    .catch((err) => {
                      logger.error(
                        errorResponseFunc(
                          "Encountered some error while updating the data.",
                          err.toString(),
                          statusCode.internalServerError,
                          constants.ERROR
                        )
                      );
                      res.send(
                        errorResponseFunc(
                          "Encountered some error while updating the data.",
                          err.toString(),
                          statusCode.internalServerError,
                          constants.ERROR
                        )
                      );
                    });
                }
              }
            } else {
              const passwordIsValid = bcrypt.compareSync(
                currentPassword,
                capUserData.password
              );

              if (!passwordIsValid) {
                logger.warn(
                  errorResponseFunc(
                    "The password is incorrect.",
                    "Incorrect password.",
                    statusCode.unauthorized,
                    constants.UNAUTHORIZED
                  )
                );
                res.send(
                  errorResponseFunc(
                    "The password is incorrect.",
                    "Incorrect password.",
                    statusCode.unauthorized,
                    constants.UNAUTHORIZED
                  )
                );
              } else {
                const dataToUpdate = {
                  password: password,
                };
                await Employees.update(dataToUpdate, {
                  where: {
                    id: userId,
                  },
                })
                  .then((data) => {
                    res.send(
                      successResponseFunc(
                        "Updated successfully.",
                        statusCode.success,
                        constants.SUCCESS
                      )
                    );
                  })
                  .catch((err) => {
                    logger.error(
                      errorResponseFunc(
                        "Encountered some error while updating the data.",
                        err.toString(),
                        statusCode.internalServerError,
                        constants.ERROR
                      )
                    );
                    res.send(
                      errorResponseFunc(
                        "Encountered some error while updating the data.",
                        err.toString(),
                        statusCode.internalServerError,
                        constants.ERROR
                      )
                    );
                  });
              }
            }
          } else {
            logger.warn(
              errorResponseFunc(
                "User not found",
                "No user found",
                statusCode.notFound,
                constants.NOTFOUND
              )
            );
            res.send(
              errorResponseFunc(
                "User not found",
                "No user found",
                statusCode.notFound,
                constants.NOTFOUND
              )
            );
          }
        })
        .catch((err) => {
          logger.error(
            errorResponseFunc(
              "Encountered some error while finding the user.",
              err.toString(),
              statusCode.internalServerError,
              constants.ERROR
            )
          );
          res.send(
            errorResponseFunc(
              "Encountered some error while finding the user.",
              err.toString(),
              statusCode.internalServerError,
              constants.ERROR
            )
          );
        });
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


const forgetPassword = async (req, res) => {
  try {
    const employeeId = req.employeeId
    const { password, confirmPassword } = req.body
    if (!password || !confirmPassword) {
      res.send(errorResponseFunc("You have to enter password and confirmPassword.", "Password and confirmPassword required.", statusCode.badRequest, constants.BADREQUEST));
    } else {
      Employees.findOne({
        where: {
          id: employeeId,
          isActive: constants.ACTIVE,
        }
      })
        .then(async (data) => {
          if (data) {
            if (password !== confirmPassword) {
              res.send(errorResponseFunc("Both passwords does not match.", "Passwords does not match.", statusCode.badRequest, constants.BADREQUEST));
            } else {
              await Employees.update({ password: password }, { where: { id: employeeId } })

              const subject = "Forget Password";
              const emailBody =
                `<html><body>` +
                `<h2>Hello ${data.firstName},</h2>` +
                `<p style="font-size:18px">Your password has been changed<br/>` +
                `This is you new login credential <br/>` +
                `<h3>Email: ${data.email}</h3>` +
                `<h3>Password: ${password}</h3><br/>` +
                `<span style="font-size:15px">Don't share this with anyone(secret) or update immediately.</center><br/>` +
                `</span></p></body></html>`;
              await sendEmail(data.email, subject, emailBody);
              res.send(successResponseFunc("Updated successfully.", statusCode.success, constants.SUCCESS))
            }
          }
        })
        .catch((err) => {
          res.send(errorResponseFunc("Encountered some error while updating the data.", err.toString(), statusCode.internalServerError, constants.ERROR));
        })
    }

  } catch (error) {
  }
}


module.exports = {
  resetPassword, forgetPassword
};
