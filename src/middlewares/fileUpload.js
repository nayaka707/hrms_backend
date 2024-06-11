const fs = require("fs");
const multer = require("multer");
const path = require("path");
const {
  statusCode,
  constants,
  errorResponseFunc,
} = require("../utils/utilsIndex");

const maxSize = 2 * 1024 * 1024;

const fileDestinations = {
  profilePicture: "profilePicture",
};

const checkFileExist = async (file) => {
  const isExist = fs.access(file, (err) => {
    if (err) {
      return false;
    }
    return true;
  });
  return isExist;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("========>file", file);
    const fieldName = file.fieldname;
    const fileRootDir = path.join(
      __dirname,
      "..",
      "public",
      "uploads"
    );
    fs.mkdirSync(fileRootDir, { recursive: true });
    const uploadPath = path.join(fileRootDir, fileDestinations[fieldName]);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const name = file.fieldname.replace(" ", "-").toLowerCase();
    const fileName = `${name}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const pdfFilter = ["application/pdf", "file/pdf"];
const imageFilter = ["image/png", "image/jpg", "image/jpeg"];
const docFilter = [
  "application/pdf",
  "file/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
];
const fileTypes = {
  profilePicture: imageFilter,
};

const fileFilter = (req, file, cb) => {
  console.log("file>>>>>>>>>>", file);
  const fileType = fileTypes[file.fieldname];
  console.log("fileType>>>>.", fileType);
  if (!fileType) {
    return cb(
      errorResponseFunc(
        "Invalid file type. Please try again.",
        "Invalid file type",
        statusCode.invalidData,
        constants.ERROR
      ),
      false
    );
  }
  if (!fileType.includes(file.mimetype)) {
    return cb(
      res.send(
        errorResponseFunc(
          `File types must be of ${fileType.join(", ")} only`,
          "File types",
          statusCode.invalidData,
          constants.ERROR
        )
      ),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter,
});

module.exports = { upload, checkFileExist };
