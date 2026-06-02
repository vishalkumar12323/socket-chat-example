import { Client } from "pg";
import { env } from "./env";

async function init() {
    const client = new Client({ connectionString: env.DATABASE_URL })
    try {
        await client.query(
            `
                    CREATE TABLE IF NOT EXISTS messages (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        client_offset TEXT UNIQUE,
                        content TEXT
                    );
                `
        );
    } catch (err) {
        console.log("Error initializing db:: ", err);
        throw new Error(err);
    } finally {
        await client.end();
    };
};