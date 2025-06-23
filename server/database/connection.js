import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'grcwalk_user',
  password: process.env.DB_PASSWORD || 'grcwalk_password',
  database: process.env.DB_NAME || 'grcwalk_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  multipleStatements: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection and create database if it doesn't exist
export const testConnection = async () => {
  try {
    // First try to connect without specifying database
    const tempConfig = { ...dbConfig };
    delete tempConfig.database;
    const tempPool = mysql.createPool(tempConfig);
    
    const connection = await tempPool.getConnection();
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.execute(`USE ${dbConfig.database}`);
    
    connection.release();
    await tempPool.end();
    
    // Now test the main connection
    const mainConnection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    mainConnection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Execute query with error handling
export const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Execute multiple queries (for schema setup)
export const executeMultipleQueries = async (queries) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    for (const query of queries) {
      if (query.trim()) {
        await connection.execute(query);
      }
    }
    
    await connection.commit();
    console.log('✅ Multiple queries executed successfully');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error executing multiple queries:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Get connection from pool
export const getConnection = async () => {
  return await pool.getConnection();
};

export default pool;