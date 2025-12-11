import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/modex_booking',
});

const migrate = async () => {
    const client = await pool.connect();
    try {
        console.log('Starting migration (JS)...');

        // 1. Add created_by to shows
        await client.query(`
            ALTER TABLE shows 
            ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id);
        `);
        console.log('Added created_by column.');

        // 2. Add Cascade to bookings
        try {
            await client.query(`
                ALTER TABLE bookings 
                DROP CONSTRAINT IF EXISTS bookings_show_id_fkey;
            `);
            await client.query(`
                ALTER TABLE bookings 
                ADD CONSTRAINT bookings_show_id_fkey 
                FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE;
            `);
            console.log('Updated bookings foreign key to Cascade.');
        } catch (e) {
            console.log('Constraint update might have failed or already exists:', e);
        }

        console.log('Migration complete.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        client.release();
        process.exit();
    }
};

migrate();
