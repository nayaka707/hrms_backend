const {
  Employees,
  Role,
  Department,
  Designation,
  Permission,
  Route,
} = require("../models/modelsIndex");

const models = {
  Employees: Employees,
  Role: Role,
  Department: Department,
  Designation: Designation,
  Permission: Permission,
  Route: Route,
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});
module.exports = models;
