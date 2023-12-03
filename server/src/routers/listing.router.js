import express from 'express';
import { listingController } from '../controllers/index.js';

const router = express.Router();

router.route('/').get(listingController.getListing);

export default router;
