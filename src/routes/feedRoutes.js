const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js')
const { getFeed, getFeedById, createFeed, deleteFeed } = require('../controllers/feedController');

const router = express.Router();

router.get('/getAllFeed',authMiddleware, getFeed);
router.get('/:id', authMiddleware, getFeedById);
router.post('/createFeed', authMiddleware, createFeed);
router.delete('/:id', authMiddleware, deleteFeed);


module.exports = router;
