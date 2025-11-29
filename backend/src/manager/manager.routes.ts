import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";

const router = express.Router();

router.get("/all", authMiddleware, roleMiddleware("manager"), (req, res) => res.json({ message: "all attendance - not implemented" }));
router.get("/employee/:id", authMiddleware, roleMiddleware("manager"), (req, res) => res.json({ message: "employee attendance - not implemented" }));
router.get("/summary", authMiddleware, roleMiddleware("manager"), (req, res) => res.json({ message: "summary - not implemented" }));
router.get("/export", authMiddleware, roleMiddleware("manager"), (req, res) => res.json({ message: "export - not implemented" }));
router.get("/today-status", authMiddleware, roleMiddleware("manager"), (req, res) => res.json({ message: "today-status - not implemented" }));

export default router;
