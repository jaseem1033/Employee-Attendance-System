import AppRepository from "../repositories/app.repository";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Kolkata");


export const EmployeeService = {
  async checkIn(user: any) {

    const today = moment().format("YYYY-MM-DD");

    // Check if already checked in today
    const existing = await AppRepository.findTodayAttendanceByUser(
      user.id,
      today
    );
    if (existing) throw new Error("Already checked in today");

    const now = moment();

    // Late if after 9:30 AM & Half Day if after 1:00 PM
    const lateCutoff = moment().set({ hour: 9, minute: 30, second: 0 });
    const halfDayCutoff = moment().set({ hour: 13, minute: 0, second: 0 });

    let status = "present";

    if (now.isAfter(halfDayCutoff)) {
        status = "halfDay";
    } else if (now.isAfter(lateCutoff)) {
        status = "late";
}

    // Insert attendance
    await AppRepository.createCheckIn({
      userId: user.id,
      date: today,
      checkInTime: now.format("YYYY-MM-DD HH:mm:ss"),
      status,
    });

    return; // No return body for POST => 204
  },

  async checkOut(user: any) {
    const today = moment().format("YYYY-MM-DD");

    const record = await AppRepository.findTodayAttendanceByUser(
      user.id,
      today
    );

    if (!record) throw new Error("You have not checked in today");
    if (record.check_out_time) throw new Error("Already checked out today");

    const now = moment();
    const checkInTime = moment(record.check_in_time);

    const totalHours = parseFloat(
      now.diff(checkInTime, "hours", true).toFixed(2)
    );

    await AppRepository.updateCheckOut({
      attendanceId: record.id,
      checkOutTime: now.format("YYYY-MM-DD HH:mm:ss"),
      totalHours,
    });

    return; // 204
  },

  async myHistory(userId: number) {
    return await AppRepository.getAttendanceHistoryByUser(userId);
  },

  async todayStatus(userId: number) {
    const today = moment().format("YYYY-MM-DD");
    const record = await AppRepository.findTodayAttendanceByUser(
      userId,
      today
    );

    if (!record) {
      return {
        status: "not_checked_in",
      };
    }

    return {
      status: record.check_out_time ? "checked_out" : "checked_in",
      checkInTime: moment(record.check_in_time).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
checkOutTime: record.check_out_time
  ? moment(record.check_out_time).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
  : null,
    };
  },

  async monthlySummary(userId: number) {
    const start = moment().startOf("month").format("YYYY-MM-DD");
    const end = moment().endOf("month").format("YYYY-MM-DD");

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
};
