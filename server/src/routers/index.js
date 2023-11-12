const express = require('express');

const router = express.Router();

router.use('/auth', require('./auth.router'));
router.use('/users', require('./users.router'));

module.exports = router;
