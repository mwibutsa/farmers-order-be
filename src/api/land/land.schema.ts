export const LandInput = {
  type: "object",
  properties: {
    upi: { type: "string" },
    landSize: { type: "number" },
    location: { type: "string" },
  },
  required: ["upi", "landSize"],
  additionalProperties: false,
};

const LandInfo = {
  type: "object",
  properties: {
    id: { type: "number" },
    farmerId: { type: "number" },
    upi: { type: "string" },
    active: { type: "boolean" },
    landSize: { type: "number" },
    location: { type: "string" },
    createdAt: { type: "string", format: "datetime-string" },
    updatedAt: { type: "string", format: "datetime-string" },
  },
};

export const LandResponse = {
  type: "object",
  properties: {
    data: LandInfo,
    status: { type: "number" },
  },
};

export const LandsResponse = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: LandInfo,
    },
    status: { type: "number" },
  },
};
