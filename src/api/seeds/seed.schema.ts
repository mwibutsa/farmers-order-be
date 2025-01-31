export const SeedInput = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 120 },
    description: { type: "string" },
    pricePerKg: { type: "number", minimum: 0 },
    fertilizerIds: {
      type: "array",
      items: { type: "number" },
      description: "IDs of compatible fertilizers",
    },
  },
  required: ["name", "pricePerKg"],
  additionalProperties: false,
};

const SeedInfo = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    description: { type: "string" },
    pricePerKg: { type: "number" },
    fertilizers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          pricePerKg: { type: "number" },
        },
      },
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
    status: { type: "number" },
  },
};
