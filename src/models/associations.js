const {
  Employees,
  Role,
  Department,
  Designation,
} = require("../models/modelsIndex");

const models = {
  Employees: Employees,
  Role: Role,
  Department: Department,
  Designation: Designation,
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});
module.exports = models;
