import express from "express";
import swaggerUI from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api-docs",
  swaggerUI.serve as unknown as express.RequestHandler[],
  swaggerUI.setup(swaggerSpec) as unknown as express.RequestHandler,
);
export default app;
