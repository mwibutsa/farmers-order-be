import swaggerJsdoc from "swagger-jsdoc";
import { FarmersResponse, FarmerInput } from "../api/farmers/farmers.schema";

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
      FarmerInput,
      FarmersResponse,
    },
  },
  securitySchemes: {
    BearerAuth: {
      type: "http",
      description: "Simple bearer token",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};

const options: swaggerJsdoc.Options = {
  definition,
  apis: ["./src/api/**/*.router.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
