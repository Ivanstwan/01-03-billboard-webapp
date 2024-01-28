import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to check for valid access token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader) return res.status(401).send('Not Authorized.');

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Forbidden.');

    req.decoded = decoded;
    next();
  });
};

export { authenticateToken };
