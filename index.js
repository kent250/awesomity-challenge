var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kentshumbusho@gmail.com',
    pass: 'kebr oiof wveh piil'
  }
});

var mailOptions = {
  from: 'rwanda@gmail.com',
  to: 'kentmars2002@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

