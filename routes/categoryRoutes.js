const express = require('express')
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');


router.get('/category', authenticateToken, authorizeRole(['admin']),categoryController.retrieveCategories);
router.post('/category', authenticateToken, authorizeRole(['admin']),categoryController.newCategory);


module.exports = router;