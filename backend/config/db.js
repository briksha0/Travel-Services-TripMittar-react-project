import mysql from "mysql2/promise";

let db; // shared connection

export async function initDB() {
  if (!db) {
    try {
      // Connect to MySQL (without database first)
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
      });

      // Create database if not exists
      await connection.query("CREATE DATABASE IF NOT EXISTS mydb");
      console.log("✅ Database 'mydb' ensured");

      // Connect to 'mydb'
      db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "mydb",
      });

      // Create tables one by one
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS hotels (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          city VARCHAR(100) NOT NULL,
          address VARCHAR(255),
          price_per_night DECIMAL(10,2),
          rating DECIMAL(2,1),
          image_url VARCHAR(255)
        );
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS hotel_bookings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          hotel_id INT NOT NULL,
          checkin DATE,
          checkout DATE,
          guests INT,
          total_price DECIMAL(10,2),
          status VARCHAR(50) DEFAULT 'CONFIRMED',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
        );
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS buses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          from_city VARCHAR(100) NOT NULL,
          to_city VARCHAR(100) NOT NULL,
          departure TIME NOT NULL,
          arrival TIME NOT NULL,
          duration VARCHAR(50),
          price DECIMAL(10,2) NOT NULL
        );
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS bus_stops (
          id INT AUTO_INCREMENT PRIMARY KEY,
          bus_id INT NOT NULL,
          stop_name VARCHAR(150) NOT NULL,
          arrival TIME,
          departure TIME,
          FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
        );
      `);

      console.log("✅ All tables ensured");

    } catch (err) {
      console.error("❌ Database initialization failed:", err.message);
      process.exit(1);
    }
  }
  return db;
}

export function getDB() {
  if (!db) throw new Error("⚠️ Database not initialized. Call initDB() first.");
  return db;
}
