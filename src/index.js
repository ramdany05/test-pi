const express = require('express')
const app = express()
const authRoutes = require('./routes/authRoutes')
require('dotenv').config();
const port = process.env.PORT 

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/auth', authRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})