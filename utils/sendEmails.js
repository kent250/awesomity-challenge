const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const transporter = require('../config/emailTransporter');

dotenv.config();

//send Verification E-mail
const sendVerification = (userId, userEmail, secret_key, baseUrl) => {
    try {
        //make E-mail token
        const token = jwt.sign(
            {
                userId: userId,
                userEmail: userEmail
            }, secret_key, {expiresIn: process.env.VERIFICATION_EMAIL_EXPIRE_TIME});

        //make base url+attach token
        const urlToSend = baseUrl +"api/auth/verify/"+ token;

        //send verification email
        const mailOptions = {
            to: userEmail,
            subject: 'Verify your Marketplace account',
            text: `Hi there, thank you for creating account with us, click link below to verify you email address ${urlToSend}`
        }

        const confirmSend = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
        });

    } catch (error) {
        console.log('Internal Server error');
        // res.status(500).json(jsend('Fail', 'Internal server error'));
    }    
}

module.exports = sendVerification;