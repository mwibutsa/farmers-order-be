// Base schemas for reuse
const PaginationSchema = {
  type: "object",
  properties: {
    currentPage: { type: "number" },
    itemsPerPage: { type: "number" },
    totalPages: { type: "number" },
    totalItems: { type: "number" },
  },
};

const FertilizerInfo = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    description: { type: "string", nullable: true },
    pricePerKg: { type: "number" },
    kgPerAcre: { type: "number" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

// Input Schemas
export const SeedInput = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 120,
      description: "Name of the seed",
    },
    description: {
      type: "string",
      description: "Description of the seed",
    },
    pricePerKg: {
      type: "number",
      minimum: 0,
      description: "Price per kilogram",
    },
    kgPerAcre: {
      type: "number",
      minimum: 0,
      description: "Quantity of seed needed per acre",
    },
    fertilizerIds: {
      type: "array",
      items: { type: "number" },
      description: "IDs of compatible fertilizers",
    },
  },
  required: ["name", "pricePerKg", "kgPerAcre"],
  additionalProperties: false,
};

export const UpdateSeedInput = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 120,
    },
    description: { type: "string" },
    pricePerKg: { type: "number", minimum: 0 },
    kgPerAcre: { type: "number", minimum: 0 },
    fertilizerIds: {
      type: "array",
      items: { type: "number" },
    },
  },
  additionalProperties: false,
};

// Response Schemas
const SeedInfo = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    description: { type: "string", nullable: true },
    pricePerKg: { type: "number" },
    kgPerAcre: { type: "number" },
    fertilizers: {
      type: "array",
      items: FertilizerInfo,
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

export const SeedResponse = {
  type: "object",
  properties: {
    data: SeedInfo,
    status: { type: "number" },
  },
};

export const SeedsResponse = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: SeedInfo,
    },
    pagination: PaginationSchema,
    status: { type: "number" },
  },
};

export const SeedWithFertilizersResponse = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        ...SeedInfo.properties,
        fertilizers: {
          type: "array",
          items: FertilizerInfo,
        },
      },
    },
    status: { type: "number" },
  },
};

export const SeedsWithFertilizersResponse = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ...SeedInfo.properties,
          fertilizers: {
            type: "array",
            items: FertilizerInfo,
          },
        },
      },
    },
    pagination: PaginationSchema,
    status: { type: "number" },
  },
};

// Error Schema
export const ErrorResponse = {
  type: "object",
  properties: {
    error: { type: "string" },
    status: { type: "number" },
  },
  required: ["error", "status"],
};
