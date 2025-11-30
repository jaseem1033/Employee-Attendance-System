import moment from "moment-timezone";
import AppRepository from "../repositories/app.repository";
import { EmployeeService } from "../employee/employee.service";
import { ManagerService } from "../manager/manager.service";

moment.tz.setDefault("Asia/Kolkata");

export const DashboardService = {
  
  // ---------------- EMPLOYEE DASHBOARD ----------------
  async managerDashboard(department: string) {
  const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

  // 1. Total employees
  const employees = await AppRepository.getEmployeesByDepartment(department);
  const totalEmployees = employees.length;

  // 2. Today's attendance
  const todayAttendance = await AppRepository.getTodayTeamStatus(department, today);

  let present = 0, late = 0, halfDay = 0, checkedOut = 0;

  todayAttendance.forEach((row: any) => {
    if (!row.status) return;

    if (row.status === "present") present++;
    if (row.status === "late") late++;
    if (row.status === "halfDay") halfDay++;
    if (row.check_out_time) checkedOut++;
  });

  const absent = employees.length - todayAttendance.filter((r: any) => r.status).length;

  // 3. Late arrivals list
  const lateArrivalsToday = todayAttendance
    .filter((r: any) => r.status === "late")
    .map((r: any) => ({
      name: r.name,
      employee_id: r.employee_id
    }));

  // 4. Absent employees list
  const absentToday = todayAttendance
    .filter((r: any) => r.status === null)
    .map((r: any) => ({
      name: r.name,
      employee_id: r.employee_id
    }));

  // 5. Weekly attendance trend (past 7 days)
  const weeklyTrend = [];
  for (let i = 0; i < 7; i++) {
    const day = moment(today).subtract(i, "days").format("YYYY-MM-DD");
    const dayAttendance = await AppRepository.getTodayTeamStatus(department, day);

    const presentCount = dayAttendance.filter((r: any) => r.status).length;
    const absentCount = employees.length - presentCount;

    weeklyTrend.push({
      date: day,
      present: presentCount,
      absent: absentCount
    });
  }

  // 6. Department-wise attendance (for all departments)
  const deptAttendance = await AppRepository.getDepartmentWiseToday(today);

  return {
    totalEmployees,
    today: {
      present,
      late,
      halfDay,
      checkedOut,
      absent
    },
    lateArrivalsToday,
    absentToday,
    weeklyTrend,
    departmentWiseAttendance: deptAttendance
  };
},
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
  }


};

