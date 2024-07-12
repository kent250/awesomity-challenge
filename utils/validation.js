// validation.js

const validateRegistrationData = (data) => {
    const { name, email, password } = data;
    const errors = [];
  
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push('Name is required and must be a non-empty string.');
    }
  
    if (!email || typeof email !== 'string' || !validateEmail(email)) {
      errors.push('Email is required and must be a valid email address.');
    }
  
    if (!password || typeof password !== 'string' || password.length < 8) {
      errors.push('Password is required and must be at least 8 characters long.');
    }
  
    return errors;
  }
  
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  
  
  module.exports = {
    validateRegistrationData
  };
  