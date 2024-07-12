const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    secret_key: process.env.SECRET_KEY,
    expiresIn: '1h'
}