const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const generateVerificationCode = () => {
    const buffer = crypto.randomBytes(3); // 3 bytes = 24 bits = 6 hex digits
    const code = parseInt(buffer.toString('hex'), 16) % 1000000; // Convert hex to int and get last 6 digits
    return code.toString().padStart(6, '0'); // Ensure it has 6 digits
}

const sendVerificationEmail = async (email, userId) => {
    let verificationCode;
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 2); 

    try {
        // Temukan dan hapus kode verifikasi lama jika ada
        await prisma.verificationCode.deleteMany({
            where: { userId: userId }
        });

        // Buat dan kirim kode verifikasi baru
        verificationCode = generateVerificationCode();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'pandoe.id@gmail.com',
                pass: 'nyunjnbiscikpyvr'
            }
        });
        const mailOptions = {
            from: 'pandoe.id@gmail.com',
            to: email,
            subject: 'Email Verification',
            html: `
               <!DOCTYPE html>
<html>
<head>
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            margin: 50px auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
        }
        .header {
            background-color: #4CAF50;
            padding: 10px 20px;
            border-radius: 8px 8px 0 0;
            color: white;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .code {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
            font-size: 24px;
            text-align: center;
            width: auto;
            margin-left: auto;
            margin-right: auto;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777777;
            text-align: center;
        }
        .code-container {
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Email</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering with us. Please use the following code to verify your email address:</p>
            <div class="code-container">
                <div class="code">${verificationCode}</div>
            </div>
            <p>If you did not sign up for this account, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Pandoe. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

            `
        };
        await transporter.sendMail(mailOptions);
        
        // Simpan kode verifikasi baru ke dalam basis data
        await prisma.verificationCode.create({
            data: {
                userId: userId,
                code: verificationCode,
                expiresAt: expirationTime
            }
        });

        return verificationCode;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}

module.exports = sendVerificationEmail;
