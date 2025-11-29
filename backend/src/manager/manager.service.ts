import AppRepository from "../repositories/app.repository";
import moment from "moment-timezone";

moment.tz.setDefault("Asia/Kolkata");

export const ManagerService = {
  
  // -------------------- EMPLOYEES LIST --------------------
  async getEmployees(department: string) {
    return await AppRepository.getEmployeesByDepartment(department);
  },

  // -------------------- EMPLOYEE ATTENDANCE --------------------
  async getEmployeeAttendance(empId: number, department: string) {
    // Verify employee exists in manager’s department
    const employee = await AppRepository.findEmployeeInDepartment(empId, department);
    if (!employee) throw new Error("Employee not found");

    return await AppRepository.getAttendanceByEmployeeId(empId);
  },

  // -------------------- TODAY TEAM STATUS --------------------
  async getTodayTeamStatus(department: string) {
    const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");


    const rows = await AppRepository.getTodayTeamStatus(department, today);

    return rows.map((item: any) => {
      const checkIn = item.check_in_time
        ? moment(item.check_in_time)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss")
        : null;

      const checkOut = item.check_out_time
        ? moment(item.check_out_time)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss")
        : null;

      // Correct status logic (PDF format)
      let status = "absent";

      if (item.status) {
        if (item.check_out_time) status = "checked_out";
        else status = item.status; // present / late / halfDay
      }

      return {
        id: item.id,
        name: item.name,
        employee_id: item.employee_id,
        department: item.department,
        status,
        checkInTime: checkIn,
        checkOutTime: checkOut,
      };
    });
  },

  // -------------------- DEPARTMENT SUMMARY --------------------
  async getSummary(department: string) {
    const start = moment().startOf("month").format("YYYY-MM-DD");
    const end = moment().endOf("month").format("YYYY-MM-DD");

    const summary = await AppRepository.getDepartmentSummary(
      department,
      start,
      end
    );

    const result: any = {
      present: 0,
      late: 0,
      halfDay: 0,
      absent: 0,
    };

    summary.forEach((row: any) => {
      result[row.status] = parseInt(row.count);
    });

    return result;
  },

  // -------------------- CSV EXPORT (CORRECTED FULL LOGIC) --------------------
  async getCSV(department: string) {
    const start = moment().startOf("month").format("YYYY-MM-DD");
    const end = moment().endOf("month").format("YYYY-MM-DD");

    // 1) All employees in department
    const employees = await AppRepository.getEmployeesByDepartment(department);

    // 2) All attendance rows in date range
    const attendance = await AppRepository.getDepartmentAttendanceForCSV(
      department,
      start,
      end
    );

    // 3) Generate all dates in this month
    const dates: string[] = [];
    let d = moment(start);
    while (d.isSameOrBefore(end)) {
      dates.push(d.format("YYYY-MM-DD"));
      d = d.add(1, "day");
    }

    // 4) Build final CSV rows (every employee x every date)
    const csvRows: any[] = [];

    for (const emp of employees) {
      for (const date of dates) {
        // 🔥 CORRECT MATCHING LOGIC:
        // attendance.user_id === employee.id  
        const row = attendance.find(
          (a: any) =>
            a.user_id === emp.id &&
            moment(a.date).format("YYYY-MM-DD") === date
        );

        if (row) {
          // Present / late / halfDay / checked_out
          csvRows.push({
            name: emp.name,
            employee_id: emp.employee_id,
            date,
            status: row.status,
            check_in_time: row.check_in_time
              ? moment(row.check_in_time)
                  .tz("Asia/Kolkata")
                  .format("YYYY-MM-DD HH:mm:ss")
              : "",
            check_out_time: row.check_out_time
              ? moment(row.check_out_time)
                  .tz("Asia/Kolkata")
                  .format("YYYY-MM-DD HH:mm:ss")
              : "",
            total_hours: row.total_hours ?? "",
          });
        } else {
          // Absent user
          csvRows.push({
            name: emp.name,
            employee_id: emp.employee_id,
            date,
            status: "absent",
            check_in_time: "",
            check_out_time: "",
            total_hours: "",
          });
        }
      }
    }
console.log("ATTENDANCE ROWS:", attendance);

    return csvRows;
  },
  async getDashboard(department: string) {
  const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

  // 1. Get all employees in department
  const employees = await AppRepository.getEmployeesByDepartment(department);

  // 2. Get today's attendance
  const attendance = await AppRepository.getTodayTeamStatus(department, today);

  // 3. Counters
  let present = 0;
  let late = 0;
  let halfDay = 0;
  let checked_out = 0;

  // Count present/late/halfDay/checked_out
  attendance.forEach((row: any) => {
    if (!row.status) return; // this means absent (no attendance row)

    if (row.check_out_time) {
      checked_out++;
    }

    if (row.status === "present") present++;
    if (row.status === "late") late++;
    if (row.status === "halfDay") halfDay++;
  });

  // 4. Absent employees
  const absent = employees.length - attendance.filter((r: any) => r.status).length;

  return {
    present,
    late,
    halfDay,
    checked_out,
    absent
  };
}


};
