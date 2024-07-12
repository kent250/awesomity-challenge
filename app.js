const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const User = require('./models/user');
const { syncModels } = require('./config/sync');

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());


syncModels().then(() => {

  // Routes
  app.post('/register', async (req, res) => {
    try {
      const { name, email, password_hash, role, is_email_verified } = req.body;

      // Create a new user
      const newUser = await User.create({
        name,
        email,
        password_hash,
        role,
        is_email_verified,
      });

      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });


  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
}).catch(err => {
  console.error('Failed to synchronize models:', err);
});
