require("dotenv").config({ path: "../../.env" });
module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "test@123",
    database: process.env.DB_NAME || "hrms_backend",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "5432",
    dialect: "postgres",
  },
};
