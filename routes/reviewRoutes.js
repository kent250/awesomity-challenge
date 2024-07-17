const express = require('express')
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

//create a review
router.post('/reviews', authenticateToken, authorizeRole(['buyer']), reviewController.createReview);

//get reviews for a single product
router.get('/reviews/product/:productId', reviewController.retrieveReviews);

module.exports = router;