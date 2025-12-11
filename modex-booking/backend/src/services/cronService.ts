import cron from 'node-cron';
import pool from '../config/database.js';
import { getIO } from '../config/socket.js';

// Run every minute
cron.schedule('* * * * *', async () => {
    console.log('Running expiry job...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Find expired bookings (older than 2 mins and PENDING)
        const expiredBookings = await client.query(
            `SELECT * FROM bookings 
             WHERE status = 'PENDING' 
             AND booked_at < NOW() - INTERVAL '2 minutes'
             FOR UPDATE`
        );

        if (expiredBookings.rows.length > 0) {
            console.log(`Found ${expiredBookings.rows.length} expired bookings.`);

            for (const booking of expiredBookings.rows) {
                // Cancel booking
                await client.query(
                    'UPDATE bookings SET status = $1 WHERE id = $2',
                    ['CANCELLED', booking.id]
                );

                // Release slot
                await client.query(
                    'UPDATE shows SET available_slots = available_slots + 1 WHERE id = $1',
                    [booking.show_id]
                );

                // Notify frontend via socket
                // We'll implement a 'showsUpdated' event later
            }

            // Emit update to all clients to refresh shows
            try {
                const io = getIO();
                io.emit('showsUpdated');
            } catch (e) {
                console.error("Socket not ready yet");
            }
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in expiry job:', error);
    } finally {
        client.release();
    }
});
