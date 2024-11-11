// src/middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
export interface AuthRequest extends Request {
  user?: IUser; // Adding a user property to the request for access in role middleware
}


const roleMiddleware = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    next();
  };
};

export default roleMiddleware;