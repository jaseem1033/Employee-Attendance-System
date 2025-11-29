import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import { managerOnly } from "../middlewares/auth.middleware";

import {
  getEmployees,
  getEmployeeAttendance,
  getTodayTeamStatus,
  getSummary,
  exportCSV
} from "./manager.controller";

const router = express.Router();

router.get("/all", authMiddleware, roleMiddleware("manager"), getEmployees);
router.get("/employee/:id", authMiddleware, roleMiddleware("manager"), getEmployeeAttendance);
router.get("/today", authMiddleware, roleMiddleware("manager"), getTodayTeamStatus);
router.get("/summary", authMiddleware, roleMiddleware("manager"), getSummary);
router.get("/export", authMiddleware, roleMiddleware("manager"), exportCSV);


export default router;
