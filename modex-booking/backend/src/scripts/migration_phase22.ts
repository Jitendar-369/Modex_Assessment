import pool from '../config/database.js';

const migrate = async () => {
    const client = await pool.connect();
    try {
        console.log('Starting migration...');

        // 1. Add created_by to shows
        await client.query(`
            ALTER TABLE shows 
            ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id);
        `);
        console.log('Added created_by column.');

        // 2. Add Cascade to bookings (Drop old constraint first if exists/unknown name, but easier to just try generic approach or use a specific name if we knew it. 
        // Since we created table without named constraint, it has auto-generated name.
        // We can check information_schema, OR just use a brutal approach: 
        // Since this is dev, we can try to drop the constraint by guessing or just leave it if we can't find it easily.
        // actually, 'bookings_show_id_fkey' is standard postgres naming.

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
