import dotenv from 'dotenv';

dotenv.config();

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error('⚠️  Could not find .env file  ⚠️');
}

const config = {
  port: parseInt(process.env.PORT, 10),
};

export default config;
