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
  titleLocationRegex as _titleLocationRegex,
} from '../constant/regex.js';
import { uploadImage } from '../helper/multerConfig.js';

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

router.route('/:id').get(listingController.getSingleListing);

// ⚠️⚠️⚠️ Please Note ⚠️⚠️⚠️
// All routes below this line are protected by the 'authenticateToken' middleware.
// Ensure that authentication is required for these routes.
router.use(authenticateToken);
// ROUTE BELOW THIS LINE USE 'authenticateToken'

// add listing
router.route('/add').post(
  [
    body('ads_name')
      .notEmpty()
      .withMessage('Advertisement Name cannot be empty')
      .custom((value) => {
        if (value && !_titleLocationRegex.test(value)) {
          throw new Error('Advertisement Name max 255 chars');
        }
        return true;
      }),
    body('location')
      .notEmpty()
      .withMessage('Location cannot be empty')
      .custom((value) => {
        if (value && !_titleLocationRegex.test(value)) {
          throw new Error('Location max 255 chars');
        }
        return true;
      }),
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

// edit listing - have very simillar logic with 'add listing'
router.route('/edit/data').post(
  [
    body('id').notEmpty().withMessage('Advertisement ID cannot be empty'),
    body('ads_name')
      .notEmpty()
      .withMessage('Advertisement Name cannot be empty')
      .custom((value) => {
        if (value && !_titleLocationRegex.test(value)) {
          throw new Error('Advertisement Name max 255 chars');
        }
        return true;
      }),
    body('location')
      .notEmpty()
      .withMessage('Location cannot be empty')
      .custom((value) => {
        if (value && !_titleLocationRegex.test(value)) {
          throw new Error('Location max 255 chars');
        }
        return true;
      }),
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

router
  .route('/add/image')
  .post(uploadImage.array('files[]'), listingController.addListingImage);

export default router;
