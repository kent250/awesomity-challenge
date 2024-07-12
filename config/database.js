const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DB_USER, process.env.PASSWORD, {
  host: process.env.HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false, // Set to true if you want Sequelize to log SQL queries
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    return sequelize;
  } catch (err) {
    console.error('Database connection error', err);
    throw err;
  }
};

module.exports = { sequelize, connectToDatabase };
