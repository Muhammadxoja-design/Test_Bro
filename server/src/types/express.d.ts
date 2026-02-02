import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string | null;
      name: string;
    };
    id?: string;
  }
}
