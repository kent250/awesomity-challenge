
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();



const user = process.env.USER;
const pass =  process.env.PASS;


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass
    }
});

module.exports = transporter
