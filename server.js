const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT;
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const app = express();
const cookieParser = require("cookie-parser");
const pinoLogger = require("pino-http");
const logger = require("./src/services/loggerService");
const env = require("dotenv")
const { upload } = require("./src/middlewares/fileUpload");
const { path } = require("./src/controllers/EmployeeDocument/employeeDocumentPackageCentral");
const multer = require("multer");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

env.config("./.env")
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: "*",
  exposedHeaders: ["Content-Disposition"],
};

app.use(cors(corsOptions));
const loggerMidlleware = pinoLogger({
  logger: logger,
  autoLogging: true,
});

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(upload.any());
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 2MB',
        error: err.message,
      });
    }
    // Add other Multer error codes if needed
  } else if (err) {
    // Handle other errors
    return res.status(500).json({
      message: 'An error occurred while uploading the file',
      error: err.message,
    });
  }
  next();
});

app.use(loggerMidlleware);

// Start the server
require("./src/routes/route")(app);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  logger.info(`Server started on port ${PORT}`);
});