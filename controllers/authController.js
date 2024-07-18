const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const jsend = require('../config/apiFormat');
const { secret_key, expiration } = require('../config/jwt');
const sendEmails = require('../utils/sendEmails');
const validatePassword = require('../utils/passwordValidator');


const secrete_key = process.env.SECRET_KEY;
const base_url =  process.env.BASE_URL;


//register admin
const registerAdmin = async (req, res) => {
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

         // Validate password strength and structure
         const passwordValidationResult = validatePassword(password);
         if (passwordValidationResult !== true) {
           return res.status(400).json(jsend('Fail', 'Password does not meet the required criteria', {Errors: passwordValidationResult} ))
            
         }
        
        //hash password
        const hashedPswd = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
          name,
          email,
          password:hashedPswd,
          role: 'admin',
          is_email_verified: true,
        });

        if (!newUser) {
          return res.status(500).json(jsend('Fail', 'Account not registered'));
        }
  
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

        // Validate password strength and structure
        const passwordValidationResult = validatePassword(password);
        if (passwordValidationResult !== true) {
          return res.status(400).json(jsend('Fail', 'Password does not meet required rules', {Errors: passwordValidationResult} ))
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
          return res.status(500).json(jsend('Fail', 'Account not registered'));
        }

      //Send verification E-mail
       const verification =  sendEmails.sendVerification(newUser.id, newUser.email, secrete_key, base_url);

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

//verify buyer account 
const verifyBuyerAccount = async (req, res) => {
  try {
    //Get and verify given token check if its legit
    const { token } = req.params;

    //check if tokenis available
    if (!token) {
      return res.status(401).json(jsend('Fail', 'Unauthorized: No token provided.'));
    }

    jwt.verify(token, secrete_key, async (err, decoded) => {
      if (err) {
        console.error('Error verifying JWT', err.name);
        return res.status(401).json(jsend('Fail', `Unauthorized: Token is not valid`));
    }

    
    //check if logged in user is also the one doing verification
    if (req.user.id !== decoded.userId) {
      return res.status(401).json(jsend('Fail', `Unauthorized: Verify link not belongs to you`));
    }

    //check if user is already verified
    const checkVerified = await User.findOne({
      where: {
        id: decoded.userId,
        is_email_verified: true
      }
    });
    if (checkVerified) {
      return res.status(202).json(jsend('Success', 'You are already verified'));
    }

    //Try to update user and return updated rows, and updated user details
    try {
      const [updatedRows, [updatedUser]] = await User.update(
        { is_email_verified: true },
        {
          where: { id: decoded.userId },
          returning: true
        }
      );

      if (updatedRows === 0) {
        return res.status(422).json(jsend('Fail', 'Your account wasn\'t verified. Try again in a moment'));
      }

      if (!updatedUser) {
        return res.status(404).json(jsend('Fail', 'User not found'));
      }

      return res.status(200).json(jsend('Success', 'Account verified successfully, Login again', 
        { id: updatedUser.id, 
          name: updatedUser.name,
          email: updatedUser.email
        }
      ));
      } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json(jsend('Fail', 'Internal server error'));
      }
    });
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json(jsend('Fail', 'Internal server error'));
  }
};

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
    login,
    verifyBuyerAccount
}