import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_postgres,
  host: process.env.DB_HOST,
  database: process.env.DB_syncroConsultores,
  password: process.env.DB_Samu040500,
  port: Number(process.env.DB_PORT) || 5432,
});

