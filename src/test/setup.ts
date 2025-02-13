import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import { prisma } from "../lib/prisma";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/models";

// Mock the prisma module
jest.mock("../lib/prisma", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

// Mock auth middleware
jest.mock("../middleware/auth.middleware", () => {
  const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.headers.authorization?.includes("valid-token")) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    (req as AuthRequest).user = { userId: 1, phoneNumber: "+250789123456" };
    next();
  };

  const authenticateAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.headers.authorization?.includes("valid-token")) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    (req as AuthRequest).user = {
      userId: 999,
      phoneNumber: "admin@example.com",
    };
    next();
  };

  return { authenticateToken, authenticateAdmin };
});

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
