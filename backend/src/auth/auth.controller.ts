import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    // debug: log registration payload email (never log passwords)
    console.log('[auth][register] payload:', { email: payload?.email })
    const result = await AuthService.register(payload);
    return res.status(201).json(result);
  } catch (err: any) {
    console.error('[auth][register] error:', err?.stack || err)
    return res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    // debug: log login attempt email (do NOT log passwords)
    console.log('[auth][login] attempt:', { email: payload?.email })
    const result = await AuthService.login(payload);
    return res.json(result);
  } catch (err: any) {
    console.error('[auth][login] error:', err?.stack || err)
    return res.status(400).json({ error: err.message });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    // user set by middleware
    const user = (req as any).user;
    const data = await AuthService.me(user.id);
    return res.json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
