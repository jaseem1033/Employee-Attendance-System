import { Request, Response } from "express";
import { ManagerService } from "./manager.service";




export const getEmployees = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ManagerService.getEmployees(user.department);
    return res.json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getEmployeeAttendance = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // manager
const empId = parseInt(req.params.id);

try {
  const data = await ManagerService.getEmployeeAttendance(empId, user.department);
  return res.json(data);
} catch (err: any) {
  if (err.message === "Employee not found") {
    return res.status(404).json({ error: err.message });
  }
  return res.status(400).json({ error: err.message });
}
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getTodayTeamStatus = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ManagerService.getTodayTeamStatus(user.department);
    return res.json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getSummary = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const data = await ManagerService.getSummary(user.department);
    return res.json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const exportCSV = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    // accept optional query params: start, end, employeeId, format
    const start = (req.query.start as string) || undefined;
    const end = (req.query.end as string) || undefined;
    const employeeId = req.query.employeeId ? parseInt(req.query.employeeId as string) : undefined;
    const format = (req.query.format as string) || 'csv'

    const rows = await ManagerService.getCSV(user.department, start, end, employeeId);

    if (format === 'json') {
      return res.json(rows);
    }

    let csv = "Name,Employee ID,Date,Status,Check In,Check Out,Total Hours\n";

    rows.forEach((r: any) => {
      csv += `${r.name},${r.employee_id},${r.date},${r.status},${r.check_in_time || ""},${r.check_out_time || ""},${r.total_hours || ""}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.csv");

    return res.send(csv);

  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // manager
    const data = await ManagerService.getDashboard(user.department);
    return res.json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

