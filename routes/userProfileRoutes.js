const express = require('express')
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const { authenticateToken } = require('../middlewares/auth');


//manage profile
router.get('/profile', authenticateToken, userProfileController.profileDetails);
router.patch('/profile', authenticateToken, userProfileController.updateProfile);


module.exports = router;