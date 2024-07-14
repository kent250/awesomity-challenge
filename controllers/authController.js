const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const jsend = require('../config/apiFormat');
const { secret_key, expiration } = require('../config/jwt');
const sendVerification = require('../utils/sendEmails');


const secrete_key = process.env.SECRET_KEY;
const base_url =  process.env.BASE_URL + 'verify/';


//register admin
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password} = req.body;
        
        //hash password
        const hashedPswd = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
          name,
          email,
          password:hashedPswd,
          role: 'admin',
          is_email_verified: false,
        });
  
        res.status(201).json({ message: 'Admin User registered successfully', user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          is_email_verified: newUser.is_email_verified
        }});
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
}
//register buyer
const registerBuyer = async (req, res) => {
    try {
        const { name, email, password} = req.body;

        //trim email address
        const trimmedEmail = email.trim();

        //validate email given
        const validateEmail = validator.isEmail(trimmedEmail);
        if (!validateEmail) {
          return res.status(422).json(jsend('Fail', 'Please enter a valid email address.'));
        }

        //check if there if email exists
        const emailExists = await User.findOne({
          where: {
              email: trimmedEmail,
          }
        });
        if (emailExists) {
            return res.status(422).json(jsend('Fail', 'The Email already registered!'));
        }

        //hash password
        const hashedPswd = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
          name,
          email: trimmedEmail,
          password:hashedPswd,
          role: 'buyer',
          is_email_verified: false,
        });

        if (!newUser) {
          return res.status(422).json(jsend('Fail', 'Account not registered'));
        }

      //Send verification E-mail
       const verification =  sendVerification(newUser.id, newUser.email, secrete_key, base_url);

       if (!verification) {
         console.log('verification email not sent');
       }
        res.status(201).json({ message: `Welcome! Check email ${newUser.email} to verify.`, user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          is_email_verified: newUser.is_email_verified
        }});

      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
}

//login
const login = async (req, res)=>{
    
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ where: { email } });
      
          if (!user) {
            return res.status(422).json({ message: 'User not found' });
          }
      
          const isPasswordValid = await bcrypt.compare(password, user.password);
      
          if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
          }
      
          // Include the user's role in the JWT
          const token = jwt.sign({ id: user.id, name:user.name, email: user.email, role: user.role }, secret_key, { expiresIn: expiration });
      
          res.json({ token });
        } catch (error) {
          res.status(500).json({ message: 'Error logging in', error: error.message });
        }
}




module.exports = {
    registerBuyer,
    registerAdmin,
    login
}