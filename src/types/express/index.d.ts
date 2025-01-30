declare namespace Express {
  interface Request {
    user: {
      userId: number;
      phoneNumber: string;
    };
  }
}
