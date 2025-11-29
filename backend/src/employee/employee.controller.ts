import { Request, Response } from "express";
import { EmployeeService } from "./employee.service";

export const checkIn = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    await EmployeeService.checkIn(user);
    return res.status(204).send();
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const checkOut = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    await EmployeeService.checkOut(user);
    return res.status(204).send();
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const myHistory = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const history = await EmployeeService.myHistory(user.id);
    return res.json(history);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const mySummary = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const summary = await EmployeeService.monthlySummary(user.id);
    return res.json(summary);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const todayStatus = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await EmployeeService.todayStatus(user.id);
    return res.json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
