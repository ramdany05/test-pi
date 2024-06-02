// src/routes/feedRoutes.js
const express = require('express');
const { getFeed, getFeedById, createFeed, deleteFeed } = require('../controllers/feedController');

const router = express.Router();

router.get('/getAllFeed', getFeed);
router.get('/:id', getFeedById);
router.post('/createFeed', createFeed);
router.delete('/:id', deleteFeed);


module.exports = router;
