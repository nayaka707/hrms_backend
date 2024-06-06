
const {
  Admin,
  Role,
  statusCode,
  constants,
  successResponseFunc,
  errorResponseFunc,
  logger
} = require("./adminPackageCentral");
const { adminCreatorFunc } = require("./adminUtils");
const addAdmin = (req, res) => {
  try {
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
      const name = req.body.name;
      const email = req.body.email;
      const roleName = req.body.roleName;

      if (!name || !roleName || !email) {
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
                        name: name,
                        email: email,
                        roleId: data.id,
                        isActive: constants.ACTIVE,
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
