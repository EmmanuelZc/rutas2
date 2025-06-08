import pool from "./config.js";

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Conexión exitosa a la base de datos!");
    client.release();
  } catch (err) {
    console.error("Error de conexión:", err);
  }
}

export default testConnection;
