import AppRepository from "../repositories/app.repository";
import moment from "moment-timezone";

moment.tz.setDefault("Asia/Kolkata");

export const EmployeeService = {
  
  // -------------------- CHECK IN --------------------
  async checkIn(user: any) {

    // Store today's date in strict IST to avoid UTC shift
    const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    // Check if already checked in today
    const existing = await AppRepository.findTodayAttendanceByUser(
      user.id,
      today
    );
    if (existing) throw new Error("Already checked in today");

    const now = moment().tz("Asia/Kolkata");

    // Cutoffs (IST)
    const lateCutoff = moment().tz("Asia/Kolkata").set({ hour: 9, minute: 30, second: 0 });
    const halfDayCutoff = moment().tz("Asia/Kolkata").set({ hour: 13, minute: 0, second: 0 });

    let status = "present";

    if (now.isAfter(halfDayCutoff)) {
      status = "halfDay";
    } else if (now.isAfter(lateCutoff)) {
      status = "late";
    }

    // Insert attendance (use DB clock for check_in_time)
    await AppRepository.createCheckIn({
      userId: user.id,
      date: today,
      status,
    });

    return; // 204
  },

  // -------------------- CHECK OUT --------------------
  async checkOut(user: any) {

    const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    const record = await AppRepository.findTodayAttendanceByUser(
      user.id,
      today
    );

    if (!record) throw new Error("You have not checked in today");
    if (record.check_out_time) throw new Error("Already checked out today");

    // Use DB to set check_out_time and compute total_hours (AppRepository handles this)
    await AppRepository.updateCheckOut({
      attendanceId: record.id,
    });

    return; // 204
  },

  // -------------------- HISTORY --------------------
  async myHistory(userId: number) {
    return await AppRepository.getAttendanceHistoryByUser(userId);
  },

  // -------------------- TODAY STATUS --------------------
  async todayStatus(userId: number) {

    const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

    const record = await AppRepository.findTodayAttendanceByUser(
      userId,
      today
    );

    if (!record) {
      return {
        status: "not_checked_in",
        checkInTime: null,
        checkOutTime: null,
      };
    }

    return {
      status: record.check_out_time ? "checked_out" : "checked_in",
      // Parse stored timestamptz preserving offset, then display in Asia/Kolkata
      checkInTime: moment.parseZone(record.check_in_time)
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss"),
      checkOutTime: record.check_out_time
        ? moment.parseZone(record.check_out_time)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss")
        : null,
    };
  },

  // -------------------- MONTHLY SUMMARY --------------------
  async monthlySummary(userId: number) {
    const start = moment().tz("Asia/Kolkata").startOf("month").format("YYYY-MM-DD");
    const end = moment().tz("Asia/Kolkata").endOf("month").format("YYYY-MM-DD");

    const summary = await AppRepository.getMonthlySummaryByUser(
      userId,
      start,
      end
    );

    let result: any = {
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
  async dashboard(userId: number) {
  const todayStatus = await this.todayStatus(userId);
  const monthlySummary = await this.monthlySummary(userId);
  const history = await this.myHistory(userId);

  // Format history date & time properly
  const formattedHistory = history.map((item: any) => ({
    date: moment(item.date).tz("Asia/Kolkata").format("YYYY-MM-DD"),
    status: item.status,
    checkInTime: item.check_in_time
      ? moment(item.check_in_time).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
      : null,
    checkOutTime: item.check_out_time
      ? moment(item.check_out_time).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
      : null,
    totalHours: item.total_hours
  }));

  return {
    todayStatus,
    monthlySummary,
    history: formattedHistory
  };
}

};
