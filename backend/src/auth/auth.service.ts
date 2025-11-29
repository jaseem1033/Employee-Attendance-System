import AppRepository from "../repositories/app.repository";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const AuthService = {
  async register({ name, email, password, role, department }: any) {
    const existing = await AppRepository.findUserByEmail(email);
    if (existing) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);
    // generate employee id like EMP001, EMP002
    const employee_id = `EMP${Date.now().toString().slice(-6)}`;

    const user = await AppRepository.createUser({
      name,
      email,
      password: hashed,
      role,
      employee_id,
      department
    });

    return {
      message: "User registered successfully",
      user
    };
  },

  async login({ email, password }: any) {
  const user = await AppRepository.findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      department: user.department,
    },
    JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employee_id,
      department: user.department,
    },
  };
}
,

  async me(userId: number) {
    const user = await AppRepository.findUserById(userId);
    return user;
  }
};
