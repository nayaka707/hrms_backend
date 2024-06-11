const {
  Employees,
  Role,
  Department,
  Designation,
  Permission,
  Route,
  BankDetails
} = require("../models/modelsIndex");

const models = {
  Employees: Employees,
  Role: Role,
  Department: Department,
  Designation: Designation,
  Permission: Permission,
  Route: Route,
  BankDetails: BankDetails
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});
module.exports = models;
