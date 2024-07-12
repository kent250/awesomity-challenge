//packages
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

//files
const { syncModels } = require('./config/sync');
const authRoutes = require('./routes/authRoutes');

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());


syncModels().then(() => {

  // Routes
    app.use(authRoutes);



  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
}).catch(err => {
  console.error('Failed to synchronize models:', err);
});
