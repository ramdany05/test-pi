// src/routes/feedRoutes.js
const express = require('express');
const { getFeed } = require('../controllers/feedController');

const router = express.Router();

router.get('/getAllFeed', getFeed);

module.exports = router;
