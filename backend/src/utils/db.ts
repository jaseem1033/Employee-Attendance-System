import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const poolConfig: any = {}

// If a DATABASE_URL (connection string) is provided (common on Render / managed Postgres), use it.
if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL
  // Enable SSL when in production and using a connection string
  if (process.env.NODE_ENV === 'production') {
    poolConfig.ssl = { rejectUnauthorized: false }
  }
} else {
  poolConfig.host = process.env.DATABASE_HOST
  poolConfig.port = Number(process.env.DATABASE_PORT || 5432)
  poolConfig.user = process.env.DATABASE_USER
  poolConfig.password = process.env.DATABASE_PASSWORD
  poolConfig.database = process.env.DATABASE_NAME
}

const pool = new Pool(poolConfig)

export default pool;
