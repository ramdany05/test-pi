// src/index.js
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const feedRoutes = require('./routes/feedRoutes');
const predictRoutes = require('./routes/predictRoutes')

require('dotenv').config();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/predict', predictRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});