import app from "./app";
import pool from "./utils/db";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await pool.connect();
    console.log("✅ Connected to Postgres");

    app.listen(PORT, () => {
      console.log(`🚀 Server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start", err);
    process.exit(1);
  }
}

start();
