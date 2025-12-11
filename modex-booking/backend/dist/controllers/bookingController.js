import pool from '../config/database.js';
export const bookAppointment = async (req, res) => {
    const { showId } = req.body;
    const userId = req.user.id;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Lock the show row for update
        const showResult = await client.query('SELECT * FROM shows WHERE id = $1 FOR UPDATE', [showId]);
        if (showResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Show not found' });
        }
        const show = showResult.rows[0];
        if (show.available_slots <= 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No slots available' });
        }
        // Check if user already has a booking for this show (optional, but good practice)
        const existingBooking = await client.query('SELECT * FROM bookings WHERE user_id = $1 AND show_id = $2 AND status != \'CANCELLED\'', [userId, showId]);
        if (existingBooking.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'You already have a booking for this show' });
        }
        // Create booking
        const bookingResult = await client.query('INSERT INTO bookings (user_id, show_id, status, booked_at) VALUES ($1, $2, $3, NOW()) RETURNING *', [userId, showId, 'CONFIRMED']);
        // Update available slots
        await client.query('UPDATE shows SET available_slots = available_slots - 1 WHERE id = $1', [showId]);
        await client.query('COMMIT');
        res.status(201).json(bookingResult.rows[0]);
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    finally {
        client.release();
    }
};
export const getMyBookings = async (req, res) => {
    const userId = req.user.id;
    try {
        const bookings = await pool.query(`SELECT b.*, s.name as show_name, s.specialty, s.start_time 
       FROM bookings b 
       JOIN shows s ON b.show_id = s.id 
       WHERE b.user_id = $1 
       ORDER BY b.booked_at DESC`, [userId]);
        res.json(bookings.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const cancelBooking = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const bookingResult = await client.query('SELECT * FROM bookings WHERE id = $1 AND user_id = $2 FOR UPDATE', [id, userId]);
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
        await client.query('UPDATE bookings SET status = $1 WHERE id = $2', ['CANCELLED', id]);
        // Release slot
        await client.query('UPDATE shows SET available_slots = available_slots + 1 WHERE id = $1', [booking.show_id]);
        await client.query('COMMIT');
        res.json({ message: 'Booking cancelled successfully' });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    finally {
        client.release();
    }
};
//# sourceMappingURL=bookingController.js.map