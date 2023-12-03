import express from 'express';
import pool from '../config/db.config.js';

// import authRouter from './auth.router';
// import usersRouter from './users.router';
import listingRouter from './listing.router.js';

const routers = express.Router();

routers.use('/listing', listingRouter);
// router.use('/auth', authRouter);
// router.use('/users', usersRouter);

routers.use('/test', async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM country;');
    res.send(rows);
  } catch (error) {
    console.log('Error querying database:', error);
  }
});

export default routers;
