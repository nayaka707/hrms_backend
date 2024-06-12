const {
  Employees,
  Role,
  Department,
  Designation,
  EmployeeDocuments,
  ExperienceDetails,
  Permission,
  Route,
  Attendance
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
  Attendance: Attendance
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});
module.exports = models;
