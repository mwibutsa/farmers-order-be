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

const SeedSchema = {
  type: "object",
  nullable: true,
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

const FertilizerSchema = {
  type: "object",
  nullable: true,
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

const OrderDetailSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    orderId: { type: "number" },
    fertilizerId: { type: "number", nullable: true },
    seedId: { type: "number", nullable: true },
    quantity: { type: "number" },
    price: { type: "number" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    seed: SeedSchema,
    fertilizer: FertilizerSchema,
  },
};

const OrderSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    farmerId: { type: "number" },
    landId: { type: "number" },
    status: {
      type: "string",
      enum: ["PENDING", "APPROVED", "REJECTED"],
    },
    totalAmount: { type: "number" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    orderDetails: {
      type: "array",
      minItems: 1,
      maxItems: 2,
      items: OrderDetailSchema,
    },
  },
};

// Input Schemas
export const CreateOrderInput = {
  type: "object",
  properties: {
    landId: { type: "number" },
    fertilizerId: { type: "number" },
    seedId: { type: "number" },
  },
  required: ["landId"],
  anyOf: [{ required: ["seedId"] }, { required: ["fertilizerId"] }],
  additionalProperties: false,
};

export const UpdateOrderStatusInput = {
  type: "object",
  properties: {
    status: {
      type: "string",
      enum: ["APPROVED", "REJECTED"],
      description: "New status for the order",
    },
  },
  required: ["status"],
};

// Response Schemas
export const OrderResponse = {
  type: "object",
  properties: {
    data: OrderSchema,
    status: { type: "number" },
  },
};

export const OrderListResponse = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: OrderSchema,
    },
    pagination: PaginationSchema,
    status: { type: "number" },
  },
};

export const OrderWithFarmerSchema = {
  ...OrderSchema,
  properties: {
    ...OrderSchema.properties,
    farmer: {
      type: "object",
      properties: {
        id: { type: "number" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        phoneNumber: { type: "string" },
      },
    },
    land: {
      type: "object",
      properties: {
        id: { type: "number" },
        landSize: { type: "number" },
        upi: { type: "string" },
        location: { type: "string", nullable: true },
      },
    },
  },
};

export const PendingOrdersResponse = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: OrderWithFarmerSchema,
    },
    pagination: PaginationSchema,
    status: { type: "number" },
  },
};

// Error Schemas
export const ErrorResponse = {
  type: "object",
  properties: {
    error: { type: "string" },
    status: { type: "number" },
  },
};
