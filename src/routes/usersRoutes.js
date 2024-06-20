// src/routes/feedRoutes.js
const express = require('express');
const {getUsers, updateUserById, getUserById, deleteUserById} = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router();

router.get('/', authMiddleware,getUsers);
router.get('/:userId', authMiddleware, getUserById);
router.patch('/:userId', authMiddleware, updateUserById);
router.delete('/:userId', authMiddleware, deleteUserById);


module.exports = router;
