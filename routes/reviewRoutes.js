const express = require('express')
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');


router.post('/reviews', authenticateToken, authorizeRole(['buyer']), reviewController.createReview);

module.exports = router;