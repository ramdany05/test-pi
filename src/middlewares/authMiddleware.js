const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'No token provided.'
            }
        });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Token expired.'
                }
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid token.'
                }
            });
        } else {
            return res.status(500).json({
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Internal server error.'
                }
            });
        }
    }
};


module.exports = authMiddleware;
