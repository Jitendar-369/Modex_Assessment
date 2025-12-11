import type { Request, Response } from 'express';
import pool from '../config/database.js';
import { getIO } from '../config/socket.js';

interface AuthRequest extends Request {
    user?: any;
}

export const createShow = async (req: AuthRequest, res: Response) => {
    const { name, specialty, start_time, end_time, total_slots, duration_minutes } = req.body;
    const userId = req.user.id;

    try {
        const newShow = await pool.query(
            'INSERT INTO shows (name, specialty, start_time, end_time, total_slots, available_slots, duration_minutes, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, specialty, start_time, end_time, total_slots, total_slots, duration_minutes, userId]
        );
        getIO().emit('showsUpdated');
        res.status(201).json(newShow.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllShows = async (req: Request, res: Response) => {
    try {
        const shows = await pool.query('SELECT * FROM shows ORDER BY start_time ASC');
        res.json(shows.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getShowById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const show = await pool.query('SELECT * FROM shows WHERE id = $1', [id]);
        if (show.rows.length === 0) {
            return res.status(404).json({ message: 'Show not found' });
        }
        res.json(show.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateShow = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, specialty, start_time, end_time, total_slots, duration_minutes } = req.body;

    // Note: User didn't strictly ask for ownership check on UPDATE, but good practice.
    // For now, focusing on the explicit request about DELETE.

    try {
        const updatedShow = await pool.query(
            'UPDATE shows SET name = $1, specialty = $2, start_time = $3, end_time = $4, total_slots = $5, duration_minutes = $6 WHERE id = $7 RETURNING *',
            [name, specialty, start_time, end_time, total_slots, duration_minutes, id]
        );

        if (updatedShow.rows.length === 0) {
            return res.status(404).json({ message: 'Show not found' });
        }

        getIO().emit('showsUpdated');
        res.json(updatedShow.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteShow = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id; // Admin ID

    try {
        // Check ownership
        const showResult = await pool.query('SELECT created_by FROM shows WHERE id = $1', [id]);
        if (showResult.rows.length === 0) {
            return res.status(404).json({ message: 'Show not found' });
        }

        const show = showResult.rows[0];

        // If created_by is null (legacy shows), allow any admin? Or restrict? 
        // User asked: "if one admin creates one he should only be able to delete his own"
        // Let's enforce: if show.created_by exists AND != userId, forbid. 
        if (show.created_by && show.created_by !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this show' });
        }

        const deletedShow = await pool.query('DELETE FROM shows WHERE id = $1 RETURNING *', [id]);

        getIO().emit('showsUpdated');
        res.json({ message: 'Show deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
