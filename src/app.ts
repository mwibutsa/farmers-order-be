import express from "express";
import swaggerUI from "swagger-ui-express";
import { errors } from "celebrate";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";
import router from "./routes";
import "#/api/admin/create-admin";
import celebrateErrorHandler from "./middleware/celebrateErrorHandler.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use(
  "/api-docs",
  swaggerUI.serve as unknown as express.RequestHandler[],
  swaggerUI.setup(swaggerSpec) as unknown as express.RequestHandler,
);

app.use(celebrateErrorHandler);
app.use(errors());
export default app;
