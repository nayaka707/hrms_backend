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


const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cap Lead API",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:9009`,
      },
    ],
  },
  apis: ["./src/swaggerDocs/*.js"],
};

env.config("./.env")
app.use(express.json());
const specs = swaggerJsDoc(swaggerOptions);

app.use("/caplead-VC-docs", swaggerUI.serve, swaggerUI.setup(specs));



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

app.use(loggerMidlleware);

// Start the server
require("./src/routes/route")(app);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  logger.info(`Server started on port ${PORT}`);
});