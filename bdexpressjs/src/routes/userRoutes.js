const express = require('express');
const { addUser, getUserByEmail } = require('../controllers/usersController');
const router = express.Router();

router.post('/add-user', addUser);
router.get('/get-user', getUserByEmail);

module.exports = router;