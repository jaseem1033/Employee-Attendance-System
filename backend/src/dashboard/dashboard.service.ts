import moment from "moment-timezone";
import AppRepository from "../repositories/app.repository";
import { EmployeeService } from "../employee/employee.service";
import { ManagerService } from "../manager/manager.service";

moment.tz.setDefault("Asia/Kolkata");

export const DashboardService = {
  
  // ---------------- EMPLOYEE DASHBOARD ----------------
  async employeeDashboard(userId: number) {
    const todayStatus = await EmployeeService.todayStatus(userId);
    const monthlySummary = await EmployeeService.monthlySummary(userId);
    const history = await EmployeeService.myHistory(userId);

    const formattedHistory = history.map((item: any) => ({
      date: moment(item.date).tz("Asia/Kolkata").format("YYYY-MM-DD"),
      status: item.status,
      checkInTime: item.check_in_time
        ? moment(item.check_in_time).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
        : null,
      checkOutTime: item.check_out_time
        ? moment(item.check_out_time).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
        : null,
      totalHours: item.total_hours,
    }));

    return {
      todayStatus,
      monthlySummary,
      history: formattedHistory
    };
  },

  // ---------------- MANAGER DASHBOARD ----------------
  async managerDashboard(department: string) {
    const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    const employees = await AppRepository.getEmployeesByDepartment(department);
    const attendance = await AppRepository.getTodayTeamStatus(department, today);

    let present = 0, late = 0, halfDay = 0, checked_out = 0;

    attendance.forEach((row: any) => {
      if (!row.status) return;
      if (row.check_out_time) checked_out++;
      if (row.status === "present") present++;
      if (row.status === "late") late++;
      if (row.status === "halfDay") halfDay++;
    });

    const absent = employees.length - attendance.filter((r: any) => r.status).length;

    return { present, late, halfDay, checked_out, absent };
  }

};
