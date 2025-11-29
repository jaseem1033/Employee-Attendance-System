import { Request, Response } from "express";
import { EmployeeService } from "./employee.service";
import moment from "moment-timezone";


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

    const formatted = history.map((item: any) => ({
      date: moment(item.date)
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD"),

      status: item.status,

      check_in_time: item.check_in_time
        ? moment(item.check_in_time)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss")
        : null,

      check_out_time: item.check_out_time
        ? moment(item.check_out_time)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss")
        : null,

      total_hours: item.total_hours,
    }));

    return res.json(formatted);
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




