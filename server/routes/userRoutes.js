const express = require('express');
const { registerUser, loginUser, getAllUsers, getUserWithId } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id',protect,  getUserWithId);
router.get('/', protect, getAllUsers);

module.exports = router;
