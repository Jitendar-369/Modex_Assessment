import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDb = async () => {
    try {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

        const schemaPath = path.join(__dirname, '../../schema.sql');
        console.log(`Reading schema from: ${schemaPath}`);

        if (!fs.existsSync(schemaPath)) {
            console.error(`File not found: ${schemaPath}`);
            process.exit(1);
        }

        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('Schema file read successfully. Length:', schemaSql.length);

        console.log('Running schema.sql...');
        await pool.query(schemaSql);
        console.log('Database schema initialized successfully.');
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

setupDb();
