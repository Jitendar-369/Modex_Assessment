import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const createDb = async () => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('DATABASE_URL is not defined');
        process.exit(1);
    }
    // Parse URL to connect to 'postgres' db instead of target db
    const url = new URL(dbUrl);
    const targetDb = url.pathname.split('/')[1];
    url.pathname = '/postgres';
    const postgresUrl = url.toString();
    const client = new Client({
        connectionString: postgresUrl,
    });
    try {
        await client.connect();
        console.log(`Connected to postgres database.`);
        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${targetDb}'`);
        if (res.rowCount === 0) {
            console.log(`Database ${targetDb} does not exist. Creating...`);
            await client.query(`CREATE DATABASE "${targetDb}"`);
            console.log(`Database ${targetDb} created successfully.`);
        }
        else {
            console.log(`Database ${targetDb} already exists.`);
        }
        await client.end();
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating database:', error);
        await client.end();
        process.exit(1);
    }
};
createDb();
//# sourceMappingURL=createDb.js.map