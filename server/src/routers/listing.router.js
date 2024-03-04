import express from 'express';
import { body, check, checkSchema, validationResult } from 'express-validator';
import { listingController } from '../controllers/index.js';
import { listingValidateSchema } from '../middlewares/listing.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  latitudeRegex as _latitudeRegex,
  longitudeRegex as _longitudeRegex,
  sizeHeightRegex as _sizeHeightRegex,
  sizeLengthRegex as _sizeLengthRegex,
} from '../constant/regex.js';

const router = express.Router();

router
  .route('/')
  .get(
    checkSchema(listingValidateSchema),
    check('userId').optional({ checkFalsy: true }).isNumeric(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      listingController.getListingWithinArea(req, res);
    }
  );

router.route('/add').post(
  authenticateToken,
  [
    body('ads_name')
      .notEmpty()
      .withMessage('Advertisement Name cannot be empty'),
    body('location').notEmpty().withMessage('Location cannot be empty'),
    body('latitude')
      .optional({ checkFalsy: true }) // Make it optional
      .custom((value) => {
        if (value && !_latitudeRegex.test(value)) {
          throw new Error('Invalid latitude format');
        }
        return true;
      }),
    body('longitude')
      .optional({ checkFalsy: true }) // Make it optional
      .custom((value) => {
        if (value && !_longitudeRegex.test(value)) {
          throw new Error('Invalid longitude format');
        }
        return true;
      }),
    body('ads_type_id')
      .notEmpty()
      .withMessage('Advertisement Name cannot be empty')
      .isNumeric()
      .withMessage('Advertisement type format wrong.'),
    body('size_height')
      .optional({ checkFalsy: true }) // Make it optional
      .custom((value) => {
        if (value && !_sizeHeightRegex.test(value)) {
          throw new Error('Invalid longitude format');
        }
        return true;
      }),
    body('size_length')
      .optional({ checkFalsy: true }) // Make it optional
      .custom((value) => {
        if (value && !_sizeLengthRegex.test(value)) {
          throw new Error('Invalid longitude format');
        }
        return true;
      }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors, '[error]');

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    listingController.addListing(req, res);
  }
);

router.route('/:id').get(listingController.getSingleListing);
router.route('/edit/:id').post(
  authenticateToken,
  [
    body('id').notEmpty().withMessage('Advertisement ID cannot be empty'),
    body('ads_name')
      .notEmpty()
      .withMessage('Advertisement Name cannot be empty'),
    body('location').notEmpty().withMessage('Location cannot be empty'),
    body('latitude')
      .optional({ checkFalsy: true }) // Make it optional
      .custom((value) => {
        if (value && !_latitudeRegex.test(value)) {
          throw new Error('Invalid latitude format');
        }
        return true;
      }),
    body('longitude')
      .optional({ checkFalsy: true }) // Make it optional
      .custom((value) => {
        if (value && !_longitudeRegex.test(value)) {
          throw new Error('Invalid longitude format');
        }
        return true;
      }),
    body('ads_type_id')
      .notEmpty()
      .withMessage('Advertisement Name cannot be empty')
      .isNumeric()
      .withMessage('Advertisement type format wrong.'),
    body('size_height')
      .optional({ checkFalsy: true }) // Make it optional
      .custom((value) => {
        if (value && !_sizeHeightRegex.test(value)) {
          throw new Error('Invalid longitude format');
        }
        return true;
      }),
    body('size_length')
      .optional({ checkFalsy: true }) // Make it optional
      .custom((value) => {
        if (value && !_sizeLengthRegex.test(value)) {
          throw new Error('Invalid longitude format');
        }
        return true;
      }),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    listingController.editListing(req, res);
  }
);

export default router;
