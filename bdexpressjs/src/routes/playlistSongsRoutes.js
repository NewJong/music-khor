const express = require('express');
const { addSongToLikedPlaylist, removeSongFromLikedPlaylist, checkSongInPlaylist,
} = require('../controllers/playlistSongsController');
const router = express.Router();


router.post('/add-to-liked-playlist', addSongToLikedPlaylist);
router.delete('/remove-from-liked-playlist', removeSongFromLikedPlaylist);
router.get('/check-song', checkSongInPlaylist);


module.exports = router;