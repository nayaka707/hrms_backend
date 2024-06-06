const Sequelize = require("sequelize");
const config = require("./config");

const db = {};

let sequelize = new Sequelize(
  config.development.database, // Use specific environment properties
  config.development.username,
  config.development.password,
  {
    port: config.development.port,
    dialect: config.development.dialect,
  },
  {
    retry: {
      match: [/Deadlock/i],
      max: 3, // Maximum rety 3 times
      backoffBase: 1000, // Initial backoff duration in ms. Default: 100,
      backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
    },
  }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
