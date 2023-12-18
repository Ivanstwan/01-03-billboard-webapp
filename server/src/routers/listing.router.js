import express from 'express';
import { body, checkSchema, validationResult } from 'express-validator';
import { listingController } from '../controllers/index.js';
import { listingValidateSchema } from '../middlewares/listing.middleware.js';

const router = express.Router();

router.route('/').get(checkSchema(listingValidateSchema), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  listingController.getListingWithinArea(req, res);
});

router
  .route('/add')
  .post(
    body('title').notEmpty(),
    body('address').notEmpty(),
    listingController.addListing
  );

router.route('/:id').get(listingController.getSingleListing);

export default router;
