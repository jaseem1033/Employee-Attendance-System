import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import employeeOnly from "../middlewares/auth.middleware";
import {
  checkIn,
  checkOut,
  myHistory,
  mySummary,
  todayStatus,
} from "./employee.controller";

const router = express.Router();

router.post("/checkin", authMiddleware, checkIn);
router.post("/checkout", authMiddleware, checkOut);
router.get("/my-history", authMiddleware, myHistory);
router.get("/my-summary", authMiddleware, mySummary);
router.get("/today", authMiddleware, todayStatus);

export default router;
