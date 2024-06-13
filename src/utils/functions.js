const fs = require("fs");

function unlinkFiles(files) {
  if (files.length !== 0) {
    files.map(file => {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.log(`Error deleting file ${file.path}:`, err);
        } else {
          console.log(`Successfully deleted ${file.path}`);
        }
      });
    });
  }
}

module.exports = { unlinkFiles };
