import mysql, { Pool } from "mysql2/promise";

// Declare a pool variable
let pool: Pool | null = null;

// Function to create and return a database connection pool
export const createConnection = async (): Promise<Pool> => {
  if (!pool) {
    try {
      // Create a new connection pool
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      console.log("Successfully connected to the database pool.");
    } catch (error) {
      console.error("Error creating the database pool:", error);
      throw error;
    }
  } else {
    console.log("Using existing database connection pool.");
  }

  return pool;
};
