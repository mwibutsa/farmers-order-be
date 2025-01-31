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
    id: { type: "number" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    poneNumber: { type: "number" },
    createdAt: { type: "string", format: "date-string" },
    updatedAt: { type: "string", format: "date-string" },
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

export const LoginInput = {
  type: "object",
  properties: {
    phoneNumber: { type: "string" },
    password: { type: "string" },
  },
};

export const TokenResponse = {
  type: "object",
  properties: {
    accessToken: { type: "string" },
    expiresIn: { type: "number" },
  },
};
