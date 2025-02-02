export const CreateFertilizerInput = {
  type: "object",
  properties: {
    name: { type: "string", description: "Name of the fertilizer" },
    description: {
      type: "string",
      description: "Description of the fertilizer",
    },
    pricePerKg: { type: "number", description: "Price per kilogram" },
    kgPerAcre: { type: "number", description: "Kilograms per acre" },
    compatibleSeedIds: {
      type: "array",
      items: { type: "number" },
      description: "Array of compatible seed IDs",
    },
  },
  required: ["name", "pricePerKg", "kgPerAcre"],
  additionalProperties: false,
};

export const UpdateFertilizerInput = {
  type: "object",
  properties: {
    name: { type: "string", description: "Name of the fertilizer" },
    description: {
      type: "string",
      description: "Description of the fertilizer",
    },
    pricePerKg: { type: "number", description: "Price per kilogram" },
    kgPerAcre: { type: "number", description: "Kilograms per acre" },
    compatibleSeedIds: {
      type: "array",
      items: { type: "number" },
      description: "Array of compatible seed IDs",
    },
  },
  additionalProperties: false,
};

const SeedType = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    description: { type: "string", nullable: true },
    pricePerKg: { type: "number" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

export const FertilizerResponse = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        description: { type: "string", nullable: true },
        pricePerKg: { type: "number" },
        kgPerAcre: { type: "number" },
        seedTypes: {
          type: "array",
          items: SeedType,
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
    status: { type: "number" },
  },
};

const PaginationInfo = {
  type: "object",
  properties: {
    currentPage: { type: "number" },
    itemsPerPage: { type: "number" },
    totalPages: { type: "number" },
    totalItems: { type: "number" },
  },
};

export const PaginatedFertilizerResponse = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          pricePerKg: { type: "number" },
          kgPerAcre: { type: "number" },
          seedTypes: {
            type: "array",
            items: SeedType,
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
    pagination: PaginationInfo,
  },
};

export const ErrorResponse = {
  type: "object",
  properties: {
    error: { type: "string" },
  },
};
