import pool from "../utils/db";

export const AppRepository = {
  // USERS
  async createUser({ name, email, password, role, employee_id, department }: any) {
    const res = await pool.query(
      `INSERT INTO users (name, email, password, role, employee_id, department)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, email, role, employee_id, department, created_at`,
      [name, email, password, role, employee_id, department]
    );
    return res.rows[0];
  },

  async findUserByEmail(email: string) {
    const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return res.rows[0];
  },

  async findUserById(id: number) {
    const res = await pool.query(
      `SELECT id, name, email, role, employee_id, department, created_at FROM users WHERE id = $1`,
      [id]
    );
    return res.rows[0];
  },

  async findUsersByDepartment(department: string) {
    const res = await pool.query(
      `SELECT id, name, email, role, employee_id, department FROM users WHERE department = $1`,
      [department]
    );
    return res.rows;
  },

  // ATTENDANCE
  async createCheckIn({ userId, date, checkInTime, status }: any) {
    const res = await pool.query(
      `INSERT INTO attendance (user_id, date, check_in_time, status) VALUES ($1,$2,$3,$4) RETURNING *`,
      [userId, date, checkInTime, status]
    );
    return res.rows[0];
  },

  async updateCheckOut({ attendanceId, checkOutTime, totalHours }: any) {
    const res = await pool.query(
      `UPDATE attendance SET check_out_time=$1, total_hours=$2 WHERE id=$3 RETURNING *`,
      [checkOutTime, totalHours, attendanceId]
    );
    return res.rows[0];
  },

  async findTodayAttendanceByUser(userId: number, date: string) {
    const res = await pool.query(
      `SELECT * FROM attendance WHERE user_id=$1 AND date=$2 LIMIT 1`,
      [userId, date]
    );
    return res.rows[0];
  },

  async getAttendanceHistoryByUser(userId: number, limit = 100) {
    const res = await pool.query(
      `SELECT date, status, check_in_time, check_out_time, total_hours FROM attendance WHERE user_id=$1 ORDER BY date DESC LIMIT $2`,
      [userId, limit]
    );
    return res.rows;
  },

  async getMonthlySummaryByUser(userId: number, monthStart: string, monthEnd: string) {
    const res = await pool.query(
      `SELECT status, COUNT(*) as count FROM attendance 
       WHERE user_id=$1 AND date BETWEEN $2 AND $3
       GROUP BY status`,
      [userId, monthStart, monthEnd]
    );
    return res.rows;
  },

  async getAllAttendanceByDepartment(department: string, fromDate?: string, toDate?: string) {
    const params: any[] = [department];
    let q = `SELECT a.*, u.name, u.employee_id, u.department FROM attendance a
             JOIN users u ON a.user_id = u.id
             WHERE u.department = $1`;

    if (fromDate) {
      params.push(fromDate);
      q += ` AND a.date >= $${params.length}`;
    }
    if (toDate) {
      params.push(toDate);
      q += ` AND a.date <= $${params.length}`;
    }
    q += ` ORDER BY a.date DESC`;
    const res = await pool.query(q, params);
    return res.rows;
  },

  async getTodayStatusByDepartment(department: string, date: string) {
    const res = await pool.query(
      `SELECT u.id, u.name, u.employee_id, a.status, a.check_in_time FROM users u
       LEFT JOIN attendance a ON a.user_id = u.id AND a.date = $2
       WHERE u.department = $1`,
      [department, date]
    );
    return res.rows;
  },

  // find attendance record by id
  async findAttendanceById(id: number) {
    const res = await pool.query(`SELECT * FROM attendance WHERE id = $1`, [id]);
    return res.rows[0];
  },

  async getEmployeesByDepartment(department: string) {
  const res = await pool.query(
    `SELECT id, name, email, role, employee_id, department 
     FROM users 
     WHERE department = $1 AND role = 'employee'
     ORDER BY name ASC`,
    [department]
  );
  return res.rows;
  },
  async getAttendanceByEmployeeId(empId: number) {
  const res = await pool.query(
    `SELECT a.*, u.name, u.employee_id 
     FROM attendance a
     JOIN users u ON u.id = a.user_id
     WHERE user_id = $1
     ORDER BY date DESC`,
    [empId]
  );
  return res.rows;
  },
  async getTodayTeamStatus(department: string, today: string) {
  const res = await pool.query(
    `SELECT 
        u.id,
        u.name,
        u.employee_id,
        u.department,
        a.status,
        a.check_in_time,
        a.check_out_time
     FROM users u
     LEFT JOIN attendance a 
        ON a.user_id = u.id AND a.date = $1
     WHERE u.department = $2 AND u.role = 'employee'
     ORDER BY u.name ASC`,
    [today, department]
  );
  return res.rows;
  },
  async getDepartmentSummary(department: string, start: string, end: string) {
  const res = await pool.query(
  `SELECT 
      a.status,
      COUNT(*) AS count
   FROM attendance a
   JOIN users u ON a.user_id = u.id
   WHERE u.department = $1
     AND a.date BETWEEN $2 AND $3
   GROUP BY a.status`,
  [department, start, end]
);

return res.rows;
  },
  async getDepartmentAttendanceForCSV(department: string, start: string, end: string) {
  const res = await pool.query(
  `SELECT 
      u.id AS user_id,
      u.name,
      u.employee_id,
      a.date,
      a.status,
      a.check_in_time,
      a.check_out_time,
      a.total_hours
    FROM attendance a
    JOIN users u ON a.user_id = u.id
    WHERE u.department = $1
      AND a.date BETWEEN $2 AND $3
    ORDER BY a.date DESC`,
  [department, start, end]
);
return res.rows;

  },
  async findEmployeeInDepartment(empId: number, department: string) {
  const res = await pool.query(
    `SELECT id, name, employee_id, department 
     FROM users 
     WHERE id = $1 AND department = $2 AND role = 'employee'
     LIMIT 1`,
    [empId, department]
  );
  return res.rows[0];
  }
};

export default AppRepository;
