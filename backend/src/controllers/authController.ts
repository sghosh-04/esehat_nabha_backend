import { Request, Response } from "express";
import pool from "../config/database";

// ✅ Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Request OTP
export const requestOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber || phoneNumber.length !== 10) {
            res.status(400).json({ success: false, message: "Invalid phone number." });
            return;
        }

        // 1. Check if user exists
        const userResult = await pool.query(
            "SELECT * FROM users WHERE phone_number = $1",
            [phoneNumber]
        );

        if (userResult.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: "User not found. Please sign up first."
            });
            return;
        }

        const user = userResult.rows[0];

        // 2. Generate OTP
        const otp = generateOTP();

        // 3. Save OTP to DB with 5-min expiry
        await pool.query(
            "UPDATE users SET otp = $1, otp_expiry = NOW() + interval '1 minutes' WHERE id = $2",
            [otp, user.id]
        );

        console.log(`📲 OTP for ${phoneNumber} is: ${otp}`);

        // 4. Send response
        res.json({
            success: true,
            message: "OTP sent successfully. (Check console for demo)",
            data: { userId: user.id, otp } // ⚠️ Remove otp in production
        });

    } catch (err) {
        console.error("Error in requestOTP:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ✅ Verify OTP
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, enteredOTP } = req.body;

        if (!userId || !enteredOTP) {
            res.status(400).json({ success: false, message: "Missing fields." });
            return;
        }

        // 1. Fetch user
        const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

        if (userResult.rows.length === 0) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        const user = userResult.rows[0];

        // 2. Check OTP match
        if (user.otp !== enteredOTP) {
            res.status(400).json({ success: false, message: "Invalid OTP." });
            return;
        }

        // 3. Check expiry
        if (new Date(user.otp_expiry) < new Date()) {
            res.status(400).json({ success: false, message: "OTP expired." });
            return;
        }

        // 4. Clear OTP after success
        await pool.query("UPDATE users SET otp = NULL, otp_expiry = NULL WHERE id = $1", [userId]);

        res.json({
            success: true,
            message: "OTP verified successfully!",
            data: {
                id: user.id,
                name: user.name,
                role: user.role,
                phoneNumber: user.phone_number
            }
        });

    } catch (err) {
        console.error("Error in verifyOTP:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
