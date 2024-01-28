import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// Function to generate Access Token
const generateAccessToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '10s',
  });
  return token;
};

export { generateAccessToken };
