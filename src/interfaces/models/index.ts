import {
  Farmer,
  Fertilizer,
  Land,
  Order,
  OrderDetails,
  Seed,
} from "@prisma/client";
import { Request } from "express";
export interface ILandInfoInput {
  farmerId: number;
  landSize: number;
  upi: string;
  location?: string;
  active?: boolean;
}

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    phoneNumber: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface CreateSeedInput {
  name: string;
  description?: string;
  pricePerKg: number;
  kgPerAcre: number;
}

export interface CreateOrderInput {
  landId: number;
  seedId?: number;
  fertilizerId?: number;
}

export interface OrderWithDetails extends Order {
  orderDetails: (OrderDetails & {
    seed: Seed | null;
    fertilizer: Fertilizer | null;
  })[];
}

export interface OrderWithFullDetails extends OrderWithDetails {
  farmer: Farmer;
  land: Land;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface OrderServiceError {
  message: string;
  code:
    | "INVALID_LAND"
    | "INVALID_SEED"
    | "INVALID_FERTILIZER"
    | "INCOMPATIBLE_PRODUCTS"
    | "DATABASE_ERROR";
}

export type FertilizerWithSeeds = Fertilizer & {
  seedTypes: Seed[];
};

export interface CreateFertilizerInput {
  name: string;
  description?: string;
  pricePerKg: number;
  kgPerAcre: number;
  compatibleSeedIds?: number[];
}
