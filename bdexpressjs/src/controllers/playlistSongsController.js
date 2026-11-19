const PlaylistSongs = require('../models/PlaylistSongs');
const User = require('../models/User');

const addSongToLikedPlaylist = async (req, res) => {
    const { email, songId, playlistId } = req.body;

    if (!email || !songId || !playlistId) {
        return res.status(400).json({ error: "Missing email, songId or playlistId" });
    }

    try {
        const userId = await User.getUserByEmail(email);
        if (!userId) return res.status(404).json({ error: "User not found" });

        const success = await PlaylistSongs.addSongToLikedPlaylist(playlistId, songId);
        res.json(success ? { success: true } : { message: "Song is already in the playlist" });
    } catch (error) {
        console.error("Error adding song to playlist:", error);
        res.status(500).json({ error: "Failed to add song" });
    }
};

const removeSongFromLikedPlaylist = async (req, res) => {
    const { email, songId, playlistId } = req.body;

    if (!email || !songId || !playlistId) {
        return res.status(400).json({ error: "Missing email, songId or playlistId" });
    }

    try {
        const userId = await User.getUserByEmail(email);
        if (!userId) return res.status(404).json({ error: "User not found" });
        
        const success = await PlaylistSongs.removeSongFromLikedPlaylist(playlistId, songId);
        res.json(success ? { success: true } : { error: "Failed to remove song" });
    } catch (error) {
        console.error("Error removing song from playlist:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const checkSongInPlaylist = async (req, res) => {
    const { playlistId, songId } = req.query;

    if (!playlistId || !songId) {
        return res.status(400).json({ error: "Missing playlistId or songId" });
    }

    try {
        const found = await PlaylistSongs.checkSongInPlaylist(playlistId, songId);
        res.json({ found });
    } catch (error) {
        console.error("Error checking song in playlist:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    addSongToLikedPlaylist,
    removeSongFromLikedPlaylist,
    checkSongInPlaylist
};