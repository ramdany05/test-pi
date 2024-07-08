// routes/ideaRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const IdeaController = require('../controllers/ideaController');

router.post('/ideas', authMiddleware, IdeaController.getThreeIdeaNamesByCriteria);

module.exports = router;
