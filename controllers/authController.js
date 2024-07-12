const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret_key, expiresIn } = require('../config/jwt');



//resgiter admin
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
  
        res.status(201).json({ message: 'User registered successfully', user: {
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
  
        res.status(201).json({ message: 'User registered successfully', user: {
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
            return res.status(404).json({ message: 'User not found' });
          }
      
          const isPasswordValid = await bcrypt.compare(password, user.password);
      
          if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
          }
      
          // Include the user's role in the JWT
          const token = jwt.sign({ id: user.id, name:user.name, email: user.email, role: user.role }, secret_key, { expiresIn });
      
          res.json({ token });
        } catch (error) {
          res.status(500).json({ message: 'Error logging in', error: error.message });
        }
}

//get user profile
const profileDetails = async (req, res)=> {
  try {
    const userprofile = req.user;
    return res.status(200).json({ message: 'Profile found', profileDetails: {
      id: userprofile.id,
      name: userprofile.name,
      email: userprofile.email
    }});
  } catch (error) {
    console.log('Error Fetching profile', error);
    res.satus(500).json({message: 'intenal server error', error: error.message});
  }
}

//edit user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword) {
      return res.status(400).json({ message: 'Password is required to update your profile info' });
    }

    // Verify current password
    const getUserPassword = async (userId) => {
      try {
        const response = await User.findOne({
          where: {
            id: userId
          }
        });
        return response.password;
      } catch (error) {
        console.error('Error fetching user password:', error);
        throw error;
      }
    };

    const currentPasswordValid = await bcrypt.compare(currentPassword, await getUserPassword(userId));
    if (!currentPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password!' });
    }

    // Check if the new email already exists in the database
    if (email) {
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [Op.not]: userId } // Exclude current user's ID
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update user profile
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;

    await User.update(updatedFields, {
      where: {
        id: userId
      }
    });

    // Return updated user details
    const updatedUser = await User.findOne({ where: { id: userId } });
    res.json({ message: 'Profile updated successfully', user:
      {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        is_email_verified: updatedUser.is_email_verified
      }});

  } catch (error) {
    console.log('Error updating profile!', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

//logout











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
    profileDetails,
    updateProfile,
    admin,
    all,
    buyer
}