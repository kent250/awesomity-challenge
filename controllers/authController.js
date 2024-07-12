const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret_key, expiresIn } = require('../config/jwt');




const registerBuyer = async (req, res) => {
    try {
        const { name, email, password} = req.body;
        
        //hash password
        const hashedPswd = await bcrypt.hash(password, 10);

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



const login = async (req, res)=>{
    
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ where: { email } });
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          const isPasswordValid = await bcrypt.compare(password, user.password);
      
          if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
          }
      
          // Include the user's role in the JWT
          const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret_key, { expiresIn });
      
          res.json({ token });
        } catch (error) {
          res.status(500).json({ message: 'Error logging in', error: error.message });
        }
}


const admin = async (req, res)=> {
  res.json({message: 'admin protected'});
}
const all = async (req, res)=> {
  res.json({message: 'all auntenticated'});
}
const buyer = async (req, res)=> {
  res.json({message: 'buyer'});
}




module.exports = {
    registerBuyer,
    login,
    admin,
    all,
    buyer
}