import express from 'express';
import { body } from 'express-validator';
import { listingController } from '../controllers/index.js';

const router = express.Router();

router.route('/').get(listingController.getListing);
router
  .route('/add')
  .post(
    body('title').notEmpty(),
    body('address').notEmpty(),
    listingController.addListing
  );
router.route('/:id').get(listingController.getSingleListing);

export default router;
