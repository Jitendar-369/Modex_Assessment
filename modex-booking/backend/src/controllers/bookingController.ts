import type { Request, Response } from 'express';
import pool from '../config/database.js';
import { getIO } from '../config/socket.js';

interface AuthRequest extends Request {
    user?: any;
}

export const bookAppointment = async (req: AuthRequest, res: Response) => {
    const { showId } = req.body;
    const userId = req.user.id;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Lock the show row for update
        const showResult = await client.query(
            'SELECT * FROM shows WHERE id = $1 FOR UPDATE',
            [showId]
        );

        if (showResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Show not found' });
        }

        const show = showResult.rows[0];

        if (show.available_slots <= 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No slots available' });
        }

        // Check for existing active bookings
        const existingBooking = await client.query(
            'SELECT * FROM bookings WHERE user_id = $1 AND show_id = $2 AND status IN (\'CONFIRMED\', \'PENDING\')',
            [userId, showId]
        );

        if (existingBooking.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'You already have a booking for this show' });
        }

        // Create booking with PENDING status
        const bookingResult = await client.query(
            'INSERT INTO bookings (user_id, show_id, status, booked_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [userId, showId, 'PENDING']
        );

        // Update available slots IMMEDIATELY to prevent others from taking it while pending
        await client.query(
            'UPDATE shows SET available_slots = available_slots - 1 WHERE id = $1',
            [showId]
        );

        await client.query('COMMIT');

        // Broadcast update via Socket.IO
        const io = getIO();
        io.emit('showsUpdated');

        res.status(201).json(bookingResult.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

export const confirmBooking = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const bookingResult = await client.query(
            'SELECT * FROM bookings WHERE id = $1 AND user_id = $2 FOR UPDATE',
            [id, userId]
        );

        if (bookingResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Booking not found' });
        }

        const booking = bookingResult.rows[0];

        if (booking.status === 'CONFIRMED') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Booking already confirmed' });
        }

        if (booking.status === 'CANCELLED') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Booking was cancelled/expired' });
        }

        // Update status to CONFIRMED
        console.log(`Confirming booking ${id} for user ${userId}`);
        const updatedBooking = await client.query(
            'UPDATE bookings SET status = $1, confirmed_at = NOW() WHERE id = $2 RETURNING *',
            ['CONFIRMED', id]
        );
        console.log('Booking confirmed:', updatedBooking.rows[0]);

        await client.query('COMMIT');

        // No need to update slots or emit socket here, as slot was taken during PENDING creation

        res.json(updatedBooking.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    try {
        const bookings = await pool.query(
            `SELECT b.*, s.name as show_name, s.specialty, s.start_time 
       FROM bookings b 
       JOIN shows s ON b.show_id = s.id 
       WHERE b.user_id = $1 
       ORDER BY b.booked_at DESC`,
            [userId]
        );
        res.json(bookings.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const bookingResult = await client.query(
            'SELECT * FROM bookings WHERE id = $1 AND user_id = $2 FOR UPDATE',
            [id, userId]
        );

        if (bookingResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Booking not found' });
        }

        const booking = bookingResult.rows[0];

        if (booking.status === 'CANCELLED') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Booking already cancelled' });
        }

        // Update booking status
        await client.query(
            'UPDATE bookings SET status = $1 WHERE id = $2',
            ['CANCELLED', id]
        );

        // Release slot
        console.log(`Releasing slot for show ${booking.show_id}. Current slots...`);
        const showUpdate = await client.query(
            'UPDATE shows SET available_slots = available_slots + 1 WHERE id = $1 RETURNING available_slots',
            [booking.show_id]
        );
        console.log(`New available slots: ${showUpdate.rows[0].available_slots}`);

        await client.query('COMMIT');

        // Broadcast update via Socket.IO
        const io = getIO();
        io.emit('showsUpdated');

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};
