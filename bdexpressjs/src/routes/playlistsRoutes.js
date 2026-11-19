const express = require('express');
const {
    getPlaylistById, searchPlaylists, getPlaylists, createPlaylistUser,
    getUserPlaylists, removeUserPlaylist, getLikedPlaylists, deleteUserPlaylist, updateUserPlaylist,
} = require('../controllers/playlistsController');
const router = express.Router();

router.get('/get-playlist', getPlaylistById);
router.get('/get-playlists', getPlaylists);
router.get('/get-user-playlists', getUserPlaylists);
router.get('/get-liked-playlists', getLikedPlaylists);
router.get('/search-playlists', searchPlaylists);
router.post('/create-playlist-user', createPlaylistUser);
router.put('/update-user-playlist', updateUserPlaylist);
router.delete('/remove-user-playlist', removeUserPlaylist);
router.delete('/delete-user-playlist', deleteUserPlaylist);

module.exports = router;
