const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { jwtSecret } = require('../config');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            return res.status(400).send('User already exists');
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
                
                // Empty all the Arry
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

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid email or password');
        }

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
