const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { jwtSecret } = require('../config');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // Validasi apakah email telah disediakan
    if (!email) {
        return res.status(400).json({
            status: 'error',
            message: 'Email is required.',
            data: null,
            error: {
                code: 'EMAIL_REQUIRED',
                details: 'Please provide your email address.'
            }
        });
    }

    try {
        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            return res.status(400).json({
                status: 'error',
                message: 'Email is already registered. Please use a different email.',
                data: null,
                error: {
                    code: 'EMAIL_EXISTS',
                    details: `The email ${email} is already registered in the system.`
                }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                duration: null,
                assets: null,
                contact: null,
                
                // Empty all the Array
                hobbies: {
                    connect: [],
                },
                experiences: {
                    connect: [],
                },
                courses: {
                    connect: [],
                },
                fundingFeeds: {
                    connect: [],
                },
                businesses: {
                    connect: [],
                },
            },
        });

        // Exclude password and other sensitive fields from the response
        const { password: _, duration: __, assets: ___, contact: ____, ...userWithoutSensitiveFields } = newUser;

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: userWithoutSensitiveFields,
            error: null
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            data: null,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                details: error.message
            }
        });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email or password',
                data: null,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    details: 'The email or password provided is incorrect.'
                }
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email or password',
                data: null,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    details: 'The email or password provided is incorrect.'
                }
            });
        }

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, jwtSecret, { expiresIn: '1h' });
        res.json({
            status: 'success',
            message: 'Login successful',
            data: { token },
            error: null
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            data: null,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                details: error.message
            }
        });
    }
};

exports.logout = async (req, res) => {
    try {
        // Token dianggap valid karena middleware authMiddleware telah memverifikasinya sebelum masuk ke sini
        res.json({
            status: 'success',
            message: 'Logout successful',
            data: null,
            error: null
        });
    }catch (error) {
        // Tangani kesalahan jika terjadi
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            data: null,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                details: error.message
            }
        });
    }
};