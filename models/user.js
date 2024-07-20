const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.js');
const { encrypt, decrypt } = require('../utils/encrypt-db.js');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    get() {
      const encryptedEmail = this.getDataValue('email');
      const decryptedEmail = encryptedEmail ? decrypt(encryptedEmail) : null;
      return decryptedEmail;
    },
    set(value) {
      const encryptedEmail = encrypt(value);
      this.setDataValue('email', encryptedEmail);
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['buyer', 'admin']],
    },
  },
  is_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
