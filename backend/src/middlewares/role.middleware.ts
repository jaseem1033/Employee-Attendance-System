import { Request, Response, NextFunction } from "express";

export default function roleMiddleware(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    if (user.role !== requiredRole) return res.status(403).json({ error: "Forbidden" });
    return next();
  };
}
