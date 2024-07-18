const PasswordValidator = require('password-validator');

const schema = new PasswordValidator();
schema
  .is().min(8)                                    // Minimum length 12
  .has().uppercase()                               // Must have uppercase letters
  .has().lowercase()                               // Must have lowercase letters
  .has().digits()                                  // Must have digits
  .is().not().oneOf(['123', '1234', 'password']);  // Not allowed Passwords

function validatePassword(password) {
  const validationResult = schema.validate(password, { details: true });
  return validationResult;
}

module.exports = validatePassword;
