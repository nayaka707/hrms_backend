const fs = require("fs");

function unlinkFiles(files) {
  if (files.length !== 0) {
    console.log("deleted file =======>", files, files.length);
    fs.unlink(files[0].path, () => {});
  }
}

module.exports = { unlinkFiles };
