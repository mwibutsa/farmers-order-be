import swaggerJsdoc from "swagger-jsdoc";
import * as farmerSchemas from "../api/farmers/farmers.schema";
import * as landSchemas from "../api/land/land.schema";
import {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_SERVER_ERROR,
} from "#/constants/httpStatus";

const definition: swaggerJsdoc.OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "Farmer Ordering System API",
    version: "1.0.0",
    description: "API documentation for the Farmer Ordering System",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API V1",
    },
  ],
  components: {
    schemas: {
      ...farmerSchemas,
      ...landSchemas,
      BadRequestError: {
        type: "object",
        properties: {
          status: { type: "number", example: HTTP_BAD_REQUEST },
          error: { type: "string" },
        },
      },
      ServerError: {
        type: "object",
        properties: {
          status: { type: "number", example: HTTP_SERVER_ERROR },
          error: { type: "string" },
        },
      },
      NotFoundError: {
        type: "object",
        properties: {
          status: { type: "number", example: HTTP_NOT_FOUND },
          error: { type: "string" },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        description: "Simple bearer token",
        scheme: "bearer",
        bearerFormat: "simple",
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  definition,
  apis: ["./src/api/**/*.router.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
