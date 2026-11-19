const UserPlaylist = require('../models/UserPlaylist');

const addUserPlaylist = async (req, res) => {
    const { user_id, playlist_id } = req.body;

    if (!user_id || !playlist_id) {
        return res.status(400).json({ success: false, message: "Missing data" });
    }

    try {
        const alreadyExists = await UserPlaylist.exists(user_id, playlist_id);
        if (alreadyExists) {
            return res.json({ success: true, message: "Playlist already added" });
        }

        const playlistAdded = await UserPlaylist.add(user_id, playlist_id);
        if (playlistAdded) {
            res.json({ success: true, message: "Playlist added" });
        } else {
            res.status(500).json({ success: false, message: "Error while adding" });
        }
    } catch (error) {
        console.error("Error adding playlist to user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const checkUserPlaylist = async (req, res) => {
    const { user_id, playlist_id } = req.query;

    if (!user_id || !playlist_id) {
        return res.json({ exists: false });
    }

    try {
        const exists = await UserPlaylist.isUserPlaylistExists(user_id, playlist_id);
        res.json({ exists });
    } catch (error) {
        console.error("Error checking playlist:", error);
        res.status(500).json({ exists: false, error: "Server error" });
    }
};

module.exports = { addUserPlaylist, checkUserPlaylist };
