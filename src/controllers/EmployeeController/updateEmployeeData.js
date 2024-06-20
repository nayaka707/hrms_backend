const {
  Employees,
  errorResponseFunc,
  statusCode,
  constants,
  successResponseFunc,
  unlinkFiles,
  logger,
  fs,
  path,
  moment,
  LeaveMaster,
  Op,
  LeaveBalance
} = require("./employeePackageCentral");
let dirnamePath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "public",
  "uploads",
  "profilePicture"
);

const updateEmployeeData = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    if (!employeeId) {
      logger.error(
        errorResponseFunc(
          "employeeId not found.",
          "employeeId not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      res.send(
        errorResponseFunc(
          "employeeId not found.",
          "employeeId not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    }

    const updateData = {
      currentAddress: req.body.currentAddress,
      permanentAddress: req.body.permanentAddress,
      pincode: req.body.pincode,
      city: req.body.city,
      state: req.body.state,
      dateOfBirth: req.body.dateOfBirth,
      qualification: req.body.qualification,
      nationality: req.body.nationality,
      passportNumber: req.body.passportNumber,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
    };

    const employee = await Employees.findByPk(employeeId);
    if (!employee) {
      logger.error(
        errorResponseFunc(
          "employee not found.",
          err.toString(),
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      res.send(
        errorResponseFunc(
          "employee not found.",
          "employee not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    }

    await employee.update(updateData);
    return res.send(
      successResponseFunc(
        "Successfully updated employee details",
        statusCode.success,
        constants.SUCCESS
      )
    );
  } catch (err) {
    logger.error(
      errorResponseFunc(
        "Encountered error while updating personal details.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    res.send(
      errorResponseFunc(
        "Encountered error while updating personal details.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

const updateSignUpDetails = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const { files = [] } = req;
    if (!employeeId) {
      unlinkFiles(files);
      logger.error(
        errorResponseFunc(
          "employeeId not found.",
          err.toString(),
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      res.send(
        errorResponseFunc(
          "employeeId not found.",
          "employeeId not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    }

    const updateData = {
      firstName: req.body.firstName,
      email: req.body.email,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      dateOfJoining: req.body.dateOfJoining,
      phoneNumber: req.body.phoneNumber,
      departmentId: req.body.departmentId,
      designationId: req.body.designationId,
      pancardNo: req.body.pancardNo,
      aadharNo: req.body.aadharNo,
      uanNo: req.body.uanNo,
      workLocation: req.body.workLocation,
      pfNo: req.body.pfNo,
      gender: req.body.gender,
      roleId: req.body.roleId,
      currentAddress: req.body.currentAddress,
      permanentAddress: req.body.permanentAddress,
      reportTo: req.body.reportTo,
      ...(files.length > 0 && {
        profilePicture: files.length > 0 ? files[0].filename : null,
      }),
    };
    const employee = await Employees.findByPk(employeeId);
    if (!employee) {
      unlinkFiles(files);
      logger.error(
        errorResponseFunc(
          "employee not found.",
          "employee not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      res.send(
        errorResponseFunc(
          "employee not found.",
          "employee not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    }
    if (employee?.profilePicture && updateData.profilePicture) {
      const oldProfile = dirnamePath + "/" + employee?.profilePicture;

      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }

    await employee.update(updateData);
    return res.send(
      successResponseFunc(
        "Successfully updated employee SignUp details",
        statusCode.success,
        constants.SUCCESS
      )
    );
  } catch (err) {
    unlinkFiles(req.files || []);
    logger.error(
      errorResponseFunc(
        "Encountered error while updating SignUp details.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    res.send(
      errorResponseFunc(
        "Encountered error while updating SignUp details.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

const probationCompleted = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const isProbationCompleted = req.body.isProbationCompleted;
    if (!employeeId) {
      logger.error(
        errorResponseFunc(
          "employeeId not found.",
          err.toString(),
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      res.send(
        errorResponseFunc(
          "employeeId not found.",
          "employeeId not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    }

    const employee = await Employees.findByPk(employeeId);

    if (!employee) {
      logger.error(
        errorResponseFunc(
          "employee not found.",
          "employee not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
      res.send(
        errorResponseFunc(
          "employee not found.",
          "employee not found.",
          statusCode.notFound,
          constants.NOTFOUND
        )
      );
    }

    const timeZone = "Asia/Kolkata";
    const now = moment.tz(timeZone);
    const day = now.date();
    const month = now.month() + 1;

    const quarterMonths = {
      1: ["January", "February", "March"],
      2: ["February", "March"],
      3: ["March"],
      4: ["April", "May", "June"],
      5: ["May", "June"],
      6: ["June"],
      7: ["July", "August", "September"],
      8: ["August", "September"],
      9: ["September"],
      10: ["October", "November", "December"],
      11: ["November", "December"],
      12: ["December"],
    };

    const monthOfQuarter = quarterMonths[month] || [];

    const totalLeaves = await LeaveMaster.sum("leaves", {
      where: {
        month: {
          [Op.in]: monthOfQuarter,
        },
      },
    });


    await LeaveBalance.update(
      { balance: totalLeaves },
      {
        where: {
          employeeId: employee?.id,
        },
      }
    );

    await employee.update({ isProbationCompleted: isProbationCompleted });
    return res.send(
      successResponseFunc(
        "Successfully updated employee's probation Completed",
        statusCode.success,
        constants.SUCCESS
      )
    );
  } catch (err) {
    logger.error(
      errorResponseFunc(
        "Encountered error while updating probation Completed",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
    res.send(
      errorResponseFunc(
        "Encountered error while updating probation Completed",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

module.exports = {
  updateEmployeeData,
  updateSignUpDetails,
  probationCompleted,
};
