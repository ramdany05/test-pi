const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { jwtSecret } = require('../config/config');

exports.register = async (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (!email) {
        return res.status(400).json({
            status: 'error',
            message: 'Email is required.',
            data: {},
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
                data: {},
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
            data: {},
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
        const user = await prisma.user.findUnique({ 
            where: { email },
            include: {
                hobbies: true,
                experiences: true,
                courses: true,
                fundingFeeds: true,
                businesses: true
            } 
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email or password',
                data: {},
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
                data: {},
                error: {
                    code: 'INVALID_CREDENTIALS',
                    details: 'The email or password provided is incorrect.'
                }
            });
        }

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, jwtSecret, { expiresIn: '1h' });
        const { password: _, ...userWithoutSensitiveFields } = user;
        res.json({
            status: 'success',
            message: 'Login successful',
            data: {user: userWithoutSensitiveFields, token },
            error: null
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            data: {},
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                details: error.message
            }
        });
    }
};


exports.logout = async (req, res) => {
    try {
        res.json({
            status: 'success',
            message: 'Logout successful',
            data: {},
            error: null
        });
    }catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            data: {},
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                details: error.message
            }
        });
    }
};