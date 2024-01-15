import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendPasswordResetEmail } from '../utils/utilsEmail.js';
import pool from '../config/db.config.js';
import { hashPassword } from '../utils/utilsPassword.js';

dotenv.config();

// register - phase 1 - send unique link to user email
const register = async (req, res) => {
  const userEmail = req.body.email;

  try {
    // Check if email already exist
    const query = 'SELECT * FROM `user` WHERE email = ?;';
    const [rows, fields] = await pool.query(query, [userEmail]);

    // If email not exist, then create new user
    if (rows.length === 0) {
      const secret = process.env.JWT_SECRET;
      const payload = {
        email: userEmail,
      };
      const token = jwt.sign(payload, secret, { expiresIn: '5m' });
      const link = `http://localhost:3000/register/create?token=${token}`;

      sendPasswordResetEmail(userEmail, link);

      res.status(200).send('Registration link has been sent to email!');
      return;
    }

    res.status(400).send('Email already registered.');
  } catch (err) {
    console.log('Error sending email:', err);
    res.status(500).send('Internal Server Error');
  }
};

// register - phase 2 - create user
const registerCreateUser = async (req, res) => {
  // get password and jwt token
  const { password, token } = req.body;

  const secret = process.env.JWT_SECRET;

  try {
    const payload = jwt.verify(token, secret);
    const userEmail = payload.email;

    // Check if email already exist
    const query = 'SELECT * FROM `user` WHERE email = ?;';
    const [rows, fields] = await pool.query(query, [userEmail]);

    // If email not exist, then create new user
    if (rows.length === 0) {
      const queryAddUser = 'INSERT INTO `user` (email, pwd) values (?, ?)';

      const hashPwd = await hashPassword(password);

      const [userRows, userFields] = await pool.query(queryAddUser, [
        userEmail,
        hashPwd,
      ]);

      if (userRows.affectedRows === 1) {
        // If one row was affected (inserted), consider it a success
        res.status(200).send('User created.');
      } else {
        // Handle other cases, e.g., no rows affected
        res.status(400).json('Failed to create user.');
      }
      return;
    }

    res.status(400).send('Email already registered.');
  } catch (err) {
    console.log('Error sending email:', err);
    res.status(500).send('Internal Server Error');
  }
};

// register - phase 1 - send unique link to user email
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exist
    const query = 'SELECT pwd FROM `user` WHERE email = ?;';
    const [rows, fields] = await pool.query(query, [email]);

    // If user with email exist, then get hash pwd
    if (rows.length > 0) {
      const result = rows[0];
      const match = await bcrypt.compare(password, result.pwd);

      if (match) {
        return res.status(200).send('User Logged in!');
      }
      return res.status(401).send('Cannot login.');
    }

    return res.status(401).send('Cannot login.');
  } catch (err) {
    console.log('Error sending email:', err);
    res.status(500).send('Internal Server Error');
  }
};

export { register, registerCreateUser, login };
