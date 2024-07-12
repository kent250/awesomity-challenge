//packages
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { swaggerUi, specs } = require('./swagger');

//files
const { syncModels } = require('./config/sync');
const authRoutes = require('./routes/authRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


syncModels().then(() => {

  // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userProfileRoutes);



  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
}).catch(err => {
  console.error('Failed to synchronize models:', err);
});
