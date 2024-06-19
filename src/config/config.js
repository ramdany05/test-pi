require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
};
