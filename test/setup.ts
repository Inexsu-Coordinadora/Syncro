import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ 
  path: path.resolve(__dirname, '../.env.test'),
  override: true
});

console.log('=== ENV VARS LOADED ===');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
console.log('=======================');