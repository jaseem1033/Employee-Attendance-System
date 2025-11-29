import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./auth/auth.routes";
import employeeRoutes from "./employee/employee.routes";
import managerRoutes from "./manager/manager.routes";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/manager", managerRoutes);

export default app;
