import { Request as MulterRequest } from 'express';
import { Response } from 'express';
import pool from '../config/database'; // update path based on your project structure

export const uploadProfileImage = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const doctorId = req.params.id;

    await pool.query(
      "UPDATE doctors SET picture_url = $1 WHERE id = $2",
      [req.file.filename, doctorId]
    );

    res.json({
      success: true,
      picture_url: req.file.filename
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image upload failed" });
  }
};
