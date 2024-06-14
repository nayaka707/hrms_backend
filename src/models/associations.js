const {
  Employees,
  Role,
  Department,
  Designation,
  EmployeeDocuments,
  ExperienceDetails,
  Permission,
  Route,
  Attendance,
  BankDetails,
  Assets,
  EmergencyContacts,
  EmployeeLogDetails
} = require("../models/modelsIndex");

const models = {
  Employees: Employees,
  Role: Role,
  Department: Department,
  Designation: Designation,
  EmployeeDocuments: EmployeeDocuments,
  ExperienceDetails: ExperienceDetails,
  Permission: Permission,
  Route: Route,
  Attendance: Attendance,
  BankDetails: BankDetails,
  EmergencyContacts:EmergencyContacts,
  Assets:Assets,
  EmployeeLogDetails: EmployeeLogDetails
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});
module.exports = models;
