import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token provided" });
  const parts = header.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Token error" });

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded; // id, email, role, department
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
export const managerOnly = (req: any, res: any, next: any) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};
export const employeeOnly = (req: any, res: any, next: any) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};


