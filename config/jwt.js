const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    secret_key: process.env.SECRET_KEY,
    expiration : process.env.JWT_USER_EXPIRE_TIME
}