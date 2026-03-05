import { Request, Response } from 'express';
import pool from '../config/database';
import { formatResponse } from '../utils/helpers';

export const getMedicines = async (req: Request, res: Response): Promise<void> => {
  const { search } = req.query;

  try {
    let query = `SELECT * FROM medicines`;
    let params: any[] = [];
    let paramCount = 0;

    if (search && typeof search === 'string') {
      paramCount++;
      query += ` WHERE name ILIKE $${paramCount} OR brand ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY name`;

    const result = await pool.query(query, params);

    res.json(formatResponse(true, undefined, { medicines: result.rows }));

  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json(formatResponse(false, 'Server error fetching medicines.'));
  }
};

// ADD MEDICINE CONTROLLER
export const addMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      brand,
      stock_quantity,
      last_restocked,
      price,
      category
    } = req.body;

    await pool.query(
      `INSERT INTO medicines
      (name, brand, stock_quantity, last_restocked, price, category)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, brand, stock_quantity, last_restocked, price, category]
    );

    res.json({
      success: true,
      message: "Medicine added successfully"
    });
  } catch (error) {
    console.error("Add medicine error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add medicine"
    });
  }
};
