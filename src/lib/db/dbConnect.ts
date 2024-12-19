import mysql, { Connection } from "mysql2/promise";

// Declare connection variable with appropriate type
let connection: Connection | null = null;

// Function to create and return a database connection
export const createConnection = async (): Promise<Connection> => {
  // If there is no existing connection, create a new one
  if (!connection) {
    try {
      connection = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
      });
      console.log("Successfully connected to the database.");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error; // Rethrow the error to handle it at a higher level
    }
  } else {
    console.log("Using existing database connection.");
  }

  // Return the existing or newly created connection
  return connection;
};
