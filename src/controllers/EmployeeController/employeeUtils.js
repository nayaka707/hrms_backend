const {
    Employees,
    constants,
    temporaryPasswordString,
    sendEmail,
    unlinkFiles,
  } = require("./employeePackageCentral");
  
  const employeeCreatorFunc = (adminDetails,files) => {
    return new Promise((resolve, reject) => {
      try {
        const password = temporaryPasswordString();
        Employees.create({
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
          permanentPasswordSet: "0",
          reportTo: adminDetails.reportTo,
          profilePicture: adminDetails.profilePicture,
        })
          .then(async (data) => {
            try {
              // const sendMail = await mailFunc(
              //   adminDetails.firstName,
              //   password,
              //   adminDetails.email
              // );
  
              const subject = " Account Creation";
              const emailBody =
                `<html><body>` +
                `<h2>Hello ${adminDetails.firstName},</h2>` +
                `<p style="font-size:18px">Your account has been created.<br/>` +
                `This is your login credentials <br/>` +
                `<h3>Email: ${adminDetails.email}</h3>` +
                `<h3>Password: ${password}</h3><br/>` +
                `<span style="font-size:15px">Don't share this with anyone(secret) or update immediately.</center><br/>` +
                `</span></p></body></html>`;
              await sendEmail(adminDetails.email, subject, emailBody);
              resolve(null);
            } catch (err) {
              reject(err);
            }
          })
          .catch((err) => {
            reject(err);
          });
      } catch (err) {
        unlinkFiles(files);
        reject(err);
      }
    });
  };
  
  // const mailFunc = (name, password, email) => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const subject = " Account Creation";
  //       const htmlFilePath = path.resolve(
  //         __dirname,
  //         "../../templates/superAdminMailTemp.html"
  //       );
  
  //       const html = fs.readFileSync(htmlFilePath);
  //       const $ = cheerio.load(html);
  
  //       const boldDiv = $("b");
  //       const span = $("span");
  
  //       boldDiv.each((index, element) => {
  //         const boldName = $(element).attr("class");
  //         const boldLabel = $(element).attr("id");
  
  //         if (boldName === "receiver-name") {
  //           $(element).text(name);
  //         }
  //         if (boldLabel === "label-div") {
  //           $(element).text("Login Password");
  //         }
  //       });
  
  //       span.each((index, element) => {
  //         const spanClass = $(element).attr("class");
  //         const spanId = $(element).attr("id");
  
  //         if (spanClass === "main-content") {
  //           $(element).text(password);
  //         }
  //         if (spanId === "messageFor") {
  //           $(element).text(
  //             "Your login password has been created on our platform."
  //           );
  //         }
  //         if (spanId === "labelType") {
  //           $(element).text("Find your login password below:");
  //         }
  //       });
  
  //       const params = {
  //         Source: `"PragetX" <${verifiedEmail}>`,
  
  //         Destination: {
  //           ToAddresses: [email],
  //         },
  
  //         Message: {
  //           Subject: {
  //             Charset: "UTF-8",
  
  //             Data: "Super Admin login password",
  //           },
  
  //           Body: {
  //             Html: {
  //               Charset: "UTF-8",
  //               Data: $.html().toString("utf-8"),
  //             },
  //           },
  //         },
  //       };
  //       await sendEmail(email, subject, params);
  //       resolve();
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // };
  
  module.exports = { employeeCreatorFunc };
  