import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import { managerOnly } from "../middlewares/auth.middleware";
import { getDashboard } from "./manager.controller";

import {
  getEmployees,
  getEmployeeAttendance,
  getTodayTeamStatus,
  getSummary,
  exportCSV
} from "./manager.controller";

const router = express.Router();

router.get("/employees", authMiddleware, roleMiddleware("manager"), getEmployees);
router.get("/employee/:id", authMiddleware, roleMiddleware("manager"), getEmployeeAttendance);
router.get("/today", authMiddleware, roleMiddleware("manager"), getTodayTeamStatus);
router.get("/summary", authMiddleware, roleMiddleware("manager"), getSummary);
router.get("/export", authMiddleware, roleMiddleware("manager"), exportCSV);
router.get("/dashboard", authMiddleware, managerOnly, getDashboard);


export default router;
