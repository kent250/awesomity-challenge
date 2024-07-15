
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();



const user = process.env.USER;
const pass =  process.env.PASS;
const service = process.env.SERVICE


const transporter = nodemailer.createTransport({
  
    service: service,
    auth: {
      user: user,
      pass: pass
    }
});

module.exports = transporter
