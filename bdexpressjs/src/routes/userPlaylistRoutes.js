const express = require('express');
const { addUserPlaylist, checkUserPlaylist } = require('../controllers/userPlaylistsController');
const router = express.Router();

router.post('/add-user-playlist', addUserPlaylist);
router.get('/check-user-playlist', checkUserPlaylist);

module.exports = router;