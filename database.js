import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:pgpassword@localhost:5432/mydb"

const pool = new Pool({
    connectionString: DATABASE_URL
});

export { pool };