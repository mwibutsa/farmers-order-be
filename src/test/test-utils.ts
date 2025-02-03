import { Request, Response } from "express";
import { AuthRequest } from "#/interfaces/models";

export const mockRequest = (data?: Partial<Request>): Request => {
  const req = {
    body: {},
    query: {},
    params: {},
    headers: {},
    cookies: {},
    get: jest.fn((x: string) => x),
    header: jest.fn((x: string) => x),
    ...data,
  } as Request;
  return req;
};

export const mockAuthRequest = (data?: Partial<AuthRequest>): AuthRequest => {
  const req = {
    body: {},
    query: {},
    params: {},
    headers: {},
    cookies: {},
    get: jest.fn((x: string) => x),
    header: jest.fn((x: string) => x),
    user: { userId: 1, phoneNumber: "+250789123456" },
    ...data,
  } as AuthRequest;
  return req;
};

export const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = jest.fn();
