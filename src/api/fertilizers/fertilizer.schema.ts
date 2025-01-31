export const CreateFertilizerInput = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    pricePerKg: { type: "number" },
    kgPerAcre: { type: "number" },
    compatibleSeedIds: {
      type: "array",
      items: { type: "number" },
    },
  },
  required: ["name", "pricePerKg", "kgPerAcre"],
};

export const FertilizerResponse = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    description: { type: "string" },
    pricePerKg: { type: "number" },
    kgPerAcre: { type: "number" },
    seedTypes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
        },
      },
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};
