require("dotenv").config({ path: "../../.env" });

// const username = process.env.DB_USERNAME || "postgres";
// const password = process.env.DB_PASSWORD || "root";
// const database = process.env.DB_NAME || "hrms_backend";
// const host = process.env.DB_HOST || "localhost";
// const port = process.env.DB_PORT || 5432 ;



module.exports = {
  development: {
    username: process.env.DB_USERNAME ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },
};
