export const FarmerInput = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    poneNumber: { type: "number" },
    password: { type: "string" },
  },
  required: ["firstName", "lastName", "poneNumber", "password"],
  additionalProperties: false,
};

export const FarmerResponse = {
  type: "object",
  properties: {
    properties: {
      id: { type: "number" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      poneNumber: { type: "number" },
      createdAt: { type: "string", format: "date-string" },
      updatedAt: { type: "string", format: "date-string" },
    },
  },
};
export const FarmersResponse = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "number" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      poneNumber: { type: "number" },
      createdAt: { type: "string", format: "date-string" },
      updatedAt: { type: "string", format: "date-string" },
    },
  },
};
