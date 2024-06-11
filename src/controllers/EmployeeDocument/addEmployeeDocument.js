const { fs } = require("../AdminController/adminPackageCentral");
const {
  statusCode,
  constants,
  successResponseFunc,
  errorResponseFunc,
  unlinkFiles,
  EmployeeDocuments,
  logger,
  path,
} = require("./employeeDocumentPackageCentral");

const addEmployeeDocument = async (req, res) => {
  try {
    const { files = [] } = req;
    if (files.length === 0) {
      unlinkFiles(req.files);
      logger.warn(
        errorResponseFunc(
          "There is no request body.",
          "No request body.",
          statusCode.badRequest,
          constants.BADREQUEST
        )
      );
      return  res.send(
        errorResponseFunc(
          "There is no request body.",
          "No request body.",
          statusCode.badRequest,
          constants.BADREQUEST
        )
      );
    } else {
      const obj = files.reduce((accumulator, file) => {
        const capitalizedFieldname = file.fieldname;
        accumulator[capitalizedFieldname] = file.filename;
        return accumulator;
      }, {});
      const payload = {
        tenMarksheet: obj.tenMarksheet || null,
        twelveMarksheet: obj.twelveMarksheet || null,
        degreeMarksheet: obj.degreeMarksheet || null,
        adharCard: obj.adharCard || null,
        panCard: obj.panCard || null,
        salarySlip1: obj.salarySlip1 || null,
        salarySlip2: obj.salarySlip2 || null,
        salarySlip3: obj.salarySlip3 || null,
        probationComplitionLetter: obj.probationComplitionLetter || null,
        appointmentLetter: obj.appointmentLetter || null,
        employeeId: req.loggersId,
      };
      const employeeDocuments = await EmployeeDocuments.findOne({
        where: {
          employeeId: payload.employeeId,
        },
      });
      if (!employeeDocuments) {
        await EmployeeDocuments.create({
          ...payload,
          isActive: "0",
        });
        return  res.send(
          successResponseFunc(
            `Documents created successfully`,
            statusCode.created,
            constants.CREATED
          )
        );
      }

      Object.keys(payload).forEach((key) => {
        let dirnamePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "src",
          "public",
          "uploads",
          `${key}`
        );
        const newFile = payload[key];
        if (newFile && employeeDocuments[key]) {
          const oldProfile = path.join(dirnamePath, employeeDocuments[key]);
          if (fs.existsSync(oldProfile)) {
            try {
              fs.unlinkSync(oldProfile);
              console.log(`Deleted old file: ${oldProfile}`);
            } catch (err) {
              console.error(`Error deleting file ${oldProfile}:`, err);
            }
          }
        }
      });

      await EmployeeDocuments.update(
        { ...payload, isActive: "1" },
        {
          where: { employeeId: payload.employeeId },
        }
      );
      return  res.send(
        successResponseFunc(
          `Documents update successfully`,
          statusCode.success,
          constants.SUCCESS
        )
      );
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
    return  res.send(
      errorResponseFunc(
        "Encountered error while syncing the admin table.",
        err.toString(),
        statusCode.internalServerError,
        constants.ERROR
      )
    );
  }
};

module.exports = addEmployeeDocument;
