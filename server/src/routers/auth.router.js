import express from 'express';
import { body, validationResult } from 'express-validator';
import { authController } from '../controllers/index.js';

const router = express.Router();

router
  .route('/register')
  .post(
    body('email')
      .notEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Invalid email format'),
    (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      authController.register(req, res);
    }
  );

router
  .route('/register/createuser')
  .post(
    [
      body('token').notEmpty().withMessage('Token cannot be empty'),
      body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 8, max: 64 })
        .withMessage('Password must be between 8 and 64 characters'),
    ],
    (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      authController.registerCreateUser(req, res);
    }
  );

router
  .route('/login')
  .post(
    [
      body('email')
        .notEmpty()
        .withMessage('Token cannot be empty')
        .isEmail()
        .withMessage('Invalid email format'),
      body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 8, max: 64 })
        .withMessage('Password must be between 8 and 64 characters'),
    ],
    (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      authController.login(req, res);
    }
  );

export default router;
