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
  tenMarksheet: "tenMarksheet",
  twelveMarksheet: "twelveMarksheet",
  degreeMarksheet: "degreeMarksheet",
  reportToImage: "reportToImage",
  adharCard: "adharCard",
  panCard: "panCard",
  salarySlip1: "salarySlip1",
  salarySlip2: "salarySlip2",
  salarySlip3: "salarySlip3",
  probationComplitionLetter: "probationComplitionLetter",
  appointmentLetter: "appointmentLetter",
  taskFile: "taskFile",
  projectFiles: "projectFiles",
  attechment: "attechment",
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
  reportToImage: imageFilter,
  tenMarksheet: pdfFilter,
  twelveMarksheet: pdfFilter,
  degreeMarksheet: pdfFilter,
  adharCard: pdfFilter,
  panCard: pdfFilter,
  salarySlip1: pdfFilter,
  salarySlip2: pdfFilter,
  salarySlip3: pdfFilter,
  probationComplitionLetter: pdfFilter,
  appointmentLetter: pdfFilter,
  projectFiles: pdfFilter,
  taskFile: pdfFilter,
  attechment: pdfFilter,
};

const fileFilter = (req, file, cb) => {
  const fileType = fileTypes[file.fieldname];
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
