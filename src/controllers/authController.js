const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { jwtSecret } = require('../config/config');
const sendVerificationEmail  = require('../services/emailServices');


exports.register = async (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

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

                verificationCode:{
                    connect: [],
                },
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

        // Kirim email verifikasi dan tunggu sampai selesai
        await sendVerificationEmail(email, newUser.id);

        // Object destructing untuk mengabaikan properti dengan menyimpannya ke dalam variabel   
        const { password: _, duration: __, assets: ___, contact: ____, verificationCode: userVerificationCode, ...userWithoutSensitiveFields } = newUser;

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


exports.sendVerificationEmail = async (req, res) => {
    const { email } = req.body;

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
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'User not found.',
                data: null,
                error: {
                    code: 'USER_NOT_FOUND',
                    details: 'No user found with the provided email address.'
                }
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                status: 'error',
                message: 'Email is already verified.',
                data: null,
                error: {
                    code: 'EMAIL_ALREADY_VERIFIED',
                    details: 'The email address is already verified.'
                }
            });
        }

        // Kirim email verifikasi dan tunggu sampai selesai
        await sendVerificationEmail(email, user.id);

        res.status(200).json({
            status: 'success',
            message: 'Verification email sent successfully.',
            data: null,
            error: null
        });
    } catch (error) {
        console.error('Error sending verification email:', error);
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


exports.verifyEmail = async (req, res) => {
    const { verificationCode } = req.query;

    try {
        if (!verificationCode) {
            return res.status(400).json({
                status: 'error',
                message: 'Verification code is required.',
                data: null,
                error: {
                    code: 'VERIFICATION_CODE_REQUIRED',
                    details: 'Please provide a verification code.'
                }
            });
        }

        // Cari pengguna berdasarkan kode verifikasi yang diberikan
        const userWithCode = await prisma.verificationCode.findFirst({
            where: {
                code: verificationCode, 
            },
            include: {
                user: true, 
            },
        });

        // Jika tidak ditemukan pengguna dengan kode yang sesuai
        if (!userWithCode || !userWithCode.user) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid verification code.',
                data: null,
                error: {
                    code: 'INVALID_VERIFICATION_CODE',
                    details: 'The provided verification code is invalid.'
                }
            });
        }

        const user = userWithCode.user;
        const codeExpiration = userWithCode.expiresAt;

        // Periksa apakah kode verifikasi sudah expired
        const now = new Date();
        if (now > codeExpiration) {
            return res.status(400).json({
                status: 'error',
                message: 'Verification code has expired.',
                data: null,
                error: {
                    code: 'EXPIRED_VERIFICATION_CODE',
                    details: 'The provided verification code has expired.'
                }
            });
        }

        // Verifikasi email dengan memberi isVerified: true
        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true }
        });

        // Hapus kode verifikasi yang tersimpan pada database
        await prisma.verificationCode.deleteMany({
            where: { userId: user.id }
        });

        res.status(200).json({
            status: 'success',
            message: 'Email verified successfully.',
            data: null,
            error: null
        });
    } catch (error) {
        console.error('Error verifying email:', error);
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

        if (!user.isVerified) {
            return res.status(400).json({
                status: 'error',
                message: 'Email not verified',
                data: null,
                error: {
                    code: 'EMAIL_NOT_VERIFIED',
                    details: 'Please verify your email address before logging in.'
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
        res.json({
            status: 'success',
            message: 'Logout successful',
            data: null,
            error: null
        });
    }catch (error) {
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