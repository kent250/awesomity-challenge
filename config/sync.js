const { connectToDatabase, sequelize } = require('../config/database');
const setupAssociations = require('../models/associations');

const syncModels = async () => {
  try {
    await connectToDatabase();
    
    setupAssociations();
    // dont drop and recreate the tables
    await sequelize.sync({ force: false });
    console.log('Database connected and models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

module.exports = {
  syncModels
};
