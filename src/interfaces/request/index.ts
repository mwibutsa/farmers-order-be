import { Request } from "express";
export interface AuthRequest extends Request {
  user?: { userId: number; phoneNumber: string };
}
export interface PaginationInfo {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  pagination?: PaginationInfo;
}

export interface ApiError {
  error: string;
  status: number;
}
