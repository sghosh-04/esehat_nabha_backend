import { Request, Response } from 'express';
import pool from '../config/database';
import { formatResponse } from '../utils/helpers';
import { PlaceOrderRequest } from '../types';


export const placeOrder = async (req: Request<{}, {}, PlaceOrderRequest>, res: Response): Promise<void> => {
  const { patient_id, kiosk_id, items, notes } = req.body;

  if (!patient_id || !kiosk_id || !items || items.length === 0) {
    res.status(400).json(formatResponse(false, 'Patient ID, kiosk ID, and order items are required.'));
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get patient name first
    const patientResult = await client.query(
      'SELECT name FROM users WHERE id = $1',
      [patient_id]
    );
    
    if (patientResult.rows.length === 0) {
      throw new Error(`Patient with ID ${patient_id} not found.`);
    }
    
    const patientName = patientResult.rows[0].name;

    let totalAmount = 0;
    for (const item of items) {
      const medicineResult = await client.query(
        'SELECT price, stock_quantity FROM medicines WHERE id = $1',
        [item.medicine_id]
      );
      
      if (medicineResult.rows.length === 0) {
        throw new Error(`Medicine with ID ${item.medicine_id} not found.`);
      }

      const medicine = medicineResult.rows[0];
      
      if (medicine.stock_quantity < item.quantity) {
        throw new Error(`Not enough stock for medicine ID ${item.medicine_id}. Available: ${medicine.stock_quantity}`);
      }

      totalAmount += parseFloat(medicine.price) * item.quantity;
    }

    // Include patient_name in the INSERT
    const orderResult = await client.query(
      `INSERT INTO orders (patient_id, patient_name, kiosk_id, total_amount, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patient_id, patientName, kiosk_id, totalAmount, notes]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, medicine_id, quantity, price_per_unit) 
         VALUES ($1, $2, $3, (SELECT price FROM medicines WHERE id = $2))`,
        [order.id, item.medicine_id, item.quantity]
      );

      await client.query(
        'UPDATE medicines SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.medicine_id]
      );
    }

    await client.query('COMMIT');

    res.status(201).json(formatResponse(true, 'Order placed successfully!', { order }));

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json(formatResponse(false, error.message || 'Server error creating order.'));
  } finally {
    client.release();
  }
};
export const getPatientOrders = async (req: Request, res: Response): Promise<void> => {
  const { patient_id } = req.params;
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT o.*, mk.name as kiosk_name, mk.address as kiosk_address,
              json_agg(
                json_build_object(
                  'medicine_name', m.name,
                  'quantity', oi.quantity,
                  'price', oi.price_per_unit
                )
              ) as items
       FROM orders o
       LEFT JOIN medical_kiosks mk ON o.kiosk_id = mk.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN medicines m ON oi.medicine_id = m.id
       WHERE o.patient_id = $1
       GROUP BY o.id, mk.name, mk.address
       ORDER BY o.created_at DESC`,
      [patient_id]
    );

    res.json(formatResponse(true, undefined, { orders: result.rows }));

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json(formatResponse(false, 'Server error fetching orders.'));
  } finally {
    client.release();
  }
};

// Add this function to your orderController.ts
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    const client = await pool.connect();

    try {
        const result = await client.query(
            `SELECT o.*, mk.name as kiosk_name, mk.address as kiosk_address,
                    json_agg(
                        json_build_object(
                            'medicine_name', m.name,
                            'quantity', oi.quantity,
                            'price', oi.price_per_unit
                        )
                    ) as items
             FROM orders o
             LEFT JOIN medical_kiosks mk ON o.kiosk_id = mk.id
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN medicines m ON oi.medicine_id = m.id
             GROUP BY o.id, mk.name, mk.address
             ORDER BY o.created_at DESC`
        );

        res.json(formatResponse(true, undefined, { orders: result.rows }));

    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json(formatResponse(false, 'Server error fetching orders.'));
    } finally {
        client.release();
    }
};

export const getOrderHistory = async (req: Request, res: Response): Promise<void> => {
  const { patient_id, patient_name } = req.query;
  const client = await pool.connect();

  try {
    if (!patient_id && !patient_name) {
      res.status(400).json(formatResponse(false, 'patient_id or patient_name is required.'));
      return;
    }

    let conditions: string[] = [];
    let values: any[] = [];

    if (patient_id) {
      values.push(patient_id);
      conditions.push(`o.patient_id = $${values.length}`);
    }

    if (patient_name) {
      values.push(`%${patient_name}%`);
      conditions.push(`o.patient_name ILIKE $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await client.query(
      `SELECT o.*, mk.name as kiosk_name, mk.address as kiosk_address,
              json_agg(
                json_build_object(
                  'medicine_name', m.name,
                  'quantity', oi.quantity,
                  'price', oi.price_per_unit
                )
              ) as items
       FROM orders o
       LEFT JOIN medical_kiosks mk ON o.kiosk_id = mk.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN medicines m ON oi.medicine_id = m.id
       ${whereClause}
       GROUP BY o.id, mk.name, mk.address
       ORDER BY o.created_at DESC`,
      values
    );

    res.json(formatResponse(true, undefined, { orders: result.rows }));
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json(formatResponse(false, 'Server error fetching order history.'));
  } finally {
    client.release();
  }
};
