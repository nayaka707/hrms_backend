const randomstring = require("randomstring");

const temporaryPasswordString = () =>
  randomstring.generate({
    length: 5,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });

const randomInvoiceString = () =>
  randomstring.generate({
    length: 2,
    charset: "numeric",
    capitalization: "uppercase",
  });
module.exports = { temporaryPasswordString, randomInvoiceString };
