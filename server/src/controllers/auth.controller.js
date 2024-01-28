import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendPasswordResetEmail } from '../utils/utilsEmail.js';
import pool from '../config/db.config.js';
import { hashPassword } from '../utils/utilsPassword.js';
import { utilsConvertToDatetime } from '../utils/utilsDate.js';
import { generateAccessToken } from '../utils/utilsToken.js';

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
      const secret = process.env.ACCESS_TOKEN_SECRET;
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

  const secret = process.env.ACCESS_TOKEN_SECRET;

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
    const query = 'SELECT * FROM `user` WHERE email = ?;';
    const [rows, fields] = await pool.query(query, [email]);

    // If user with email exist, then get hash pwd
    if (rows.length > 0) {
      const result = rows[0];
      const { username, email: userEmail, img, id: userId } = result;
      const match = await bcrypt.compare(password, result.pwd);

      // If user password match, user OK
      if (match) {
        const accessToken = await generateAccessToken({ email: userEmail });

        const refreshToken = await jwt.sign(
          { userId },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '1d' }
        );

        // Calculate the expiration date for the refresh token (30 days from now)
        const currentDate = new Date();
        const expirationDate = new Date(
          currentDate.getTime() + 24 * 60 * 60 * 1000
        );
        const expiresAt = utilsConvertToDatetime(expirationDate);

        // Saving refresh token logic
        const saveRefreshTokenQuery =
          'INSERT INTO `auth_token` (user_id, refresh_token, expires_at) values (?, ?, ?);';

        const tokenResult = await pool.query(saveRefreshTokenQuery, [
          userId,
          refreshToken,
          expiresAt,
        ]);

        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          // maxAge = 1 day (x1000 because milisecond)
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res
          .status(200)
          .json({ username, email: userEmail, img, accessToken });
      }
      return res.status(401).send('Cannot login.');
    }

    return res.status(401).send('Cannot login.');
  } catch (err) {
    console.log('Error sending email:', err);
    res.status(500).send('Internal Server Error');
  }
};

const authRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.status(401).send('Not Authorized.');

    // Get userId
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const jwtVerify = jwt.verify(refreshToken, secret);
    const { userId } = jwtVerify;

    // Check if the refresh token exists in the database
    const query =
      'SELECT * FROM auth_token JOIN user ON auth_token.user_id = user.id WHERE refresh_token = ? AND user_id = ?';
    const [rows, fields] = await pool.query(query, [refreshToken, userId]);

    // Refresh Token not exist
    if (rows.length === 0) {
      return res.status(403).send('Not Authorized.'); // Refresh token not found
    }

    // Refresh Token exist,
    // Check expires date
    const { expires_at: expiresAt, username, email, img } = rows[0];
    const expiresDateToken = new Date(expiresAt);
    const currDate = new Date();

    // Compare the dates
    if (expiresDateToken > currDate) {
      const accessToken = await generateAccessToken({ email });
      return res
        .status(200)
        .json({ username, email, img, access_token: accessToken });
    }

    return res.status(401).send('Not Authorized.');
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

export { register, registerCreateUser, login, authRefreshToken };
