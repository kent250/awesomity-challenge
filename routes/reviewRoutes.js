const express = require('express')
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');


router.get('/reviews', reviewController.createReview);

module.exports = router;