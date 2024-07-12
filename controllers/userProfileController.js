const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');


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
  

  module.exports = {
    profileDetails,
    updateProfile
  }