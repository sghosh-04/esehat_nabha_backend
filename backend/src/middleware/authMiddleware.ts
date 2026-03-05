import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  doctor?: {
    id: number;
    email: string;
    role: string;
    type: string; // "doctor"
  };
  kiosk?: {
    id: number;
    email: string;
    role: string;
    type: string; // "kiosk"
  };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const secret = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Attach payload to correct property
    if (decoded.type === "doctor") {
      req.doctor = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        type: decoded.type,
      };
    } else if (decoded.type === "kiosk") {
      req.kiosk = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        type: decoded.type,
      };
    }

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
