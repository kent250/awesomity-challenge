const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const transporter = require('../config/emailTransporter');

dotenv.config();

//send Verification E-mail
const sendVerification = async (userId, userEmail, secret_key, baseUrl) => {
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

const sendOrderStatusUpdate = async (userEmail, userNames, orderStatus, orderId,  orderDate, totalAmount) => {
    try {
         const mailOptions = {
            to: userEmail,
            subject: 'Order Status Update',
            text: `
                    Dear ${userNames},

                    We are writing to inform you that the status of your order #${orderId} has been updated to ${orderStatus}.

                    Order Details:
                    - Order Number: #${orderId}
                    - New Status: ${orderStatus}
                    - Order Date: ${orderDate}
                    - Total Amount: Rwf ${totalAmount}

                    If you have any questions about your order, please don't hesitate to contact our customer support team.

                    Thank you for shopping with us!
                  `
        }

        const confirmSend = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }else{
                console.log('Update email sent to buyer')
            }
        });
    } catch (error) {
         console.log('Internal Server error', error);
    }
}

// module.exports = sendVerification;
// module.exports = sendOrderStatusUpdate;

module.exports = {
    sendVerification,
    sendOrderStatusUpdate
}