// require("dotenv").config({ path: "../../.env" });


// module.exports = {
//   development: {
//     username: process.env.DB_USERNAME ,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME ,
//     host: process.env.DB_HOST ,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//   },
// };

require("dotenv").config({ path: '../../.env' });
// require("dotenv").config();

console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "HRMS",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  },
};