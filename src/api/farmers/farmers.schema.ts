const FarmerBase = {
  type: "object",
  properties: {
    id: { type: "number" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

export const CreateFarmerInput = {
  type: "object",
  properties: {
    firstName: { type: "string", description: "Farmer's first name" },
    lastName: { type: "string", description: "Farmer's last name" },
    phoneNumber: { type: "string", description: "Farmer's phone number" },
    password: { type: "string", description: "Account password" },
  },
  required: ["firstName", "lastName", "phoneNumber", "password"],
  additionalProperties: false,
};

export const FarmerResponse = {
  type: "object",
  properties: {
    data: FarmerBase,
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

export const FarmersResponse = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: FarmerBase,
    },
    pagination: PaginationInfo,
    status: { type: "number" },
  },
};

export const LoginInput = {
  type: "object",
  properties: {
    phoneNumber: { type: "string", description: "Farmer's phone number" },
    password: { type: "string", description: "Account password" },
  },
  required: ["phoneNumber", "password"],
};

export const TokenResponse = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        expiresIn: { type: "number" },
      },
    },
    status: { type: "number" },
  },
};

export const ErrorResponse = {
  type: "object",
  properties: {
    error: { type: "string" },
    status: { type: "number" },
  },
};
