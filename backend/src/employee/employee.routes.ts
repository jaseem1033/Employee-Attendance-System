import express from "express";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/checkin", authMiddleware, (req, res) => res.json({ message: "checkin - not implemented" }));
router.post("/checkout", authMiddleware, (req, res) => res.json({ message: "checkout - not implemented" }));
router.get("/my-history", authMiddleware, (req, res) => res.json({ message: "my-history - not implemented" }));
router.get("/my-summary", authMiddleware, (req, res) => res.json({ message: "my-summary - not implemented" }));
router.get("/today", authMiddleware, (req, res) => res.json({ message: "today - not implemented" }));

export default router;
