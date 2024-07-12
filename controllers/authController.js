const User = require('../models/user');
const brcrypt = require('bcrypt');


const registerBuyer = async (req, res) => {
    try {
        const { name, email, password} = req.body;
        
        //hash password
        const hashedPswd = await brcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
          name,
          email,
          password:hashedPswd,
          role: 'buyer',
          is_email_verified: false,
        });
  
        res.status(201).json({ message: 'User registered successfully', user: newUser });
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
}

module.exports = {
    registerBuyer
}