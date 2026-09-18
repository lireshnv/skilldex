import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./crypto";
import { Role } from "./roles";

export interface AuthedRequest extends Request {
  auth?: { userId: string; role: Role };
}

// Real server-side enforcement, not a frontend-only guard: any route using
// this middleware rejects requests without a valid signed JWT, regardless
// of what the client claims. requireRole further restricts by role — the
// role comes from the token issued at login, never from a client-supplied
// field, so a student can't self-elevate by editing a request body.
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Invalid or expired session" });

  req.auth = { userId: payload.sub, role: payload.role as Role };
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ error: "Not authenticated" });
    if (!roles.includes(req.auth.role)) return res.status(403).json({ error: "Access denied for this role" });
    next();
  };
}
