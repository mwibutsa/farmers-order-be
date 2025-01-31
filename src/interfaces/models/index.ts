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
