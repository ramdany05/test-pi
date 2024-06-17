const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.js')
const { getFeed, getFeedById, createFeed, deleteFeed, updateFeed } = require('../controllers/feedController');
const upload = require('../middlewares/multerConfig.js');

const router = express.Router();

router.get('/getAllFeed', getFeed);
router.get('/:id', authMiddleware, getFeedById);
router.post('/createFeed', upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'pitchDeck', maxCount: 1 }]), authMiddleware, createFeed);
router.put('/:id', authMiddleware, updateFeed)
router.delete('/:id', authMiddleware, deleteFeed);


module.exports = router;
