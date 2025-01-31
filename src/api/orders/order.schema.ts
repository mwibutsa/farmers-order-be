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

export const OrderResponse = {
  type: "object",
  properties: {
    data: {
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
          items: {
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
              seed: {
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
              },
              fertilizer: {
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
              },
            },
          },
        },
      },
    },
  },
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
