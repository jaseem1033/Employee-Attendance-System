import { Router } from "express";
import authMiddleware, { managerOnly, employeeOnly } from "../middlewares/auth.middleware";
import { 
  getEmployeeDashboard,
  getManagerDashboard
} from "./dashboard.controller";

const router = Router();

// Employee dashboard
router.get("/employee", authMiddleware, employeeOnly, getEmployeeDashboard);

// Manager dashboard
router.get("/manager", authMiddleware, managerOnly, getManagerDashboard);

export default router;
