import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { executeQuery } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database schema...');
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      await executeQuery(statement);
    }
    
    console.log('✅ Database schema setup completed');
  } catch (error) {
    console.error('❌ Error setting up database schema:', error);
    throw error;
  }
};