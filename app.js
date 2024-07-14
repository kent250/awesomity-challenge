//packages
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { swaggerUi, specs } = require('./swagger');
const jwt = require('jsonwebtoken');

//files
const { syncModels } = require('./config/sync');
const authRoutes = require('./routes/authRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

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
    app.use('/api', categoryRoutes);
    app.use('/api', productRoutes);






































    app.get('/verify/:token', (req, res) => {
      const { token } = req.params;
      try {
        jwt.verify(token, 'sdfjdhsjhfjshdjhjkhsjkhdskdjkhsfhjkhkjhsdkdjkhfsk', (err, decoded)=>{
          res.json(decoded);
        });

      } catch (error) {
        console.log('Internal server error');
        res.status(500).json({message: 'internal server error'});
      }
      
    });
















































  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
}).catch(err => {
  console.error('Failed to synchronize models:', err);
});
