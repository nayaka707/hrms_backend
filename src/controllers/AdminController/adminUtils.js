const {
  Admin,
  constants,
  temporaryPasswordString,
} = require("./adminPeckageCentral");

const adminCreatorFunc = (adminDetails) => {
  return new Promise((resolve, reject) => {
    try {
      const password = temporaryPasswordString();
      Admin.create({
        email: adminDetails.email.toLowerCase(),
        password: password,
        isActive: constants.ACTIVE,
        roleId: adminDetails.roleId,
        firstName: adminDetails.firstName,
        middleName: adminDetails.middleName,
        lastName: adminDetails.lastName,
        dateOfJoining: adminDetails.dateOfJoining,
        phoneNumber: adminDetails.phoneNumber,
        departmentId: adminDetails.departmentId,
        designationId: adminDetails.designationId,
        pancardNo: adminDetails.pancardNo,
        aadharNo: adminDetails.aadharNo,
        uanNo: adminDetails.uanNo,
        workLocation: adminDetails.workLocation,
        pfNo: adminDetails.pfNo,
        gender: adminDetails.gender,
        currentAddress: adminDetails.currentAddress,
        permanentAddress: adminDetails.permanentAddress,
        reportTo: adminDetails.reportTo,
      })
        .then(async (data) => {
          try {
            const sendMail = await mailFunc(
              adminDetails.name,
              password,
              adminDetails.email
            );
            resolve(sendMail);
          } catch (err) {
            reject(err);
          }
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { adminCreatorFunc };
