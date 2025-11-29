import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export const getEmployeeDashboard = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await DashboardService.employeeDashboard(user.id);
    return res.json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getManagerDashboard = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await DashboardService.managerDashboard(user.department);
    return res.json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
