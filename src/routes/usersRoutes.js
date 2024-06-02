// src/routes/feedRoutes.js
const express = require('express');
const {getUsers, updateUserById} = require('../controllers/usersController');

const router = express.Router();

router.get('/', getUsers);
router.put('/:id', updateUserById);


module.exports = router;
