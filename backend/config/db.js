import mysql from "mysql2/promise";

let db; // shared connection

// ✅ initialize DB connection
export async function initDB() {
  if (!db) {
    db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "mydb",
    });
    console.log("✅ Connected to MySQL");
  }
  return db;
}
