import { Client } from "pg";
import { env } from "./env.js";

async function init() {
    const client = new Client({ connectionString: env.DATABASE_URL })
    try {
        await client.connect();
        console.log("CREATING 'messages' TABLE.....");
        await client.query(
            `
                    CREATE TABLE IF NOT EXISTS messages (
                        id SERIAL PRIMARY KEY,
                        client_offset TEXT UNIQUE,
                        content TEXT
                    );
                `
        );
        console.log("TABLE SUCCESSFULLY CREATED.....");
    } catch (err) {
        console.log("Error initializing db:: ", err);
        throw new Error(err);
    } finally {
        await client.end();
    };
};

init();