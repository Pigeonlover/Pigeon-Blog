//
import pg from "pg";

const dbConnectionString = process.env.NEXT_DATABASE_URL;

// Creating new database pool
export const db = new pg.Pool({
  connectionString: dbConnectionString,
});
