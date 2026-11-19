const Playlist = require('../models/Playlist');
const UserPlaylist = require('../models/UserPlaylist');
const User = require('../models/User');

const getPlaylistById = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "Id is not specified" });
    }

    try {
        const playlist = await Playlist.getById(id);
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }
        res.json(playlist);
    } catch (err) {
        console.error("Error fetching playlist:", err);
        res.status(500).json({ error: "Server error" });
    }
};

const searchPlaylists = async (req, res) => {
    try {
        const q = req.query.q ? req.query.q.trim() : '';
        if (q === '') {
            return res.json([]);
        }

        const results = await Playlist.search(q);
        res.json(results);
    } catch (err) {
        console.error('Error searching playlists:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getPlaylists = async (req, res) => {
    try {
        const includeLiked = req.query.include_liked !== '0';
        const genre = req.query.genre || null;
        const playlists = await Playlist.getAll(includeLiked, genre);
        res.json(playlists);
    } catch (error) {
        console.error("Error fetching playlists:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const createPlaylistUser = async (req, res) => {
    const { user_id, email, title, artists, cover } = req.body;

    if (!title) {
        return res.status(400).json({ success: false, message: "Title is required" });
    }

    if (!artists) {
        return res.status(400).json({ success: false, message: "Artists is required" });
    }

    if (!user_id && !email) {
        return res.status(400).json({ success: false, message: "Either user_id or email must be provided" });
    }

    try {
        let finalUserId = user_id;

        if (!finalUserId) {
            const user = await User.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            finalUserId = user.id;
        }

        const playlistId = await Playlist.createUserPlaylist(title, artists, cover);
        if (!playlistId) {
            return res.status(500).json({ success: false, message: "Error creating playlist" });
        }

        const linked = await UserPlaylist.linkUserToPlaylist(finalUserId, playlistId);
        if (!linked) {
            return res.status(500).json({ success: false, message: "Playlist created but failed to link to user" });
        }

        res.json({
            success: true,
            message: "Playlist created and linked to user",
            playlist_id: playlistId
        });

    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getUserPlaylists = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: "Email is not specified" });
    }

    try {
        const playlists = await Playlist.getUserPlaylists(email);
        res.json(playlists);
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        res.status(500).json({ error: "Server error" });
    }
};


const removeUserPlaylist = async (req, res) => {
    const { user_id, playlist_id } = req.body;

    if (!user_id || !playlist_id) {
        return res.status(400).json({ success: false, message: "Missing data" });
    }

    try {
        const deleted = await UserPlaylist.removeUserPlaylist(user_id, playlist_id);

        if (deleted) {
            res.json({ success: true, message: "Playlist deleted" });
        } else {
            res.status(404).json({ success: false, message: "Playlist not found" });
        }
    } catch (error) {
        console.error("Error deleting playlist:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getLikedPlaylists = async (req, res) => {
    const { email } = req.query;

    if (!email) return res.status(400).json({ error: "User email is not specified" });

    try {
        const userId = await User.getUserByEmail(email);
        if (!userId) return res.status(404).json({ error: "User not found" });

        const playlists = await Playlist.getLikedPlaylists(userId.id);
        res.json(playlists);
    } catch (error) {
        console.error("Error fetching liked playlists:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const deleteUserPlaylist = async (req, res) => {
    const { user_id, playlist_id } = req.body;

    if (!user_id || !playlist_id) {
        return res.status(400).json({ success: false, message: "Missing data" });
    }

    try {
        const result = await Playlist.deleteUserPlaylist(user_id, playlist_id);

        if (!result.success) {
            return res.status(403).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error("Error deleting playlist:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const updateUserPlaylist = async (req, res) => {
    const { user_id, playlist_id, title, cover } = req.body;

    if (!user_id || !playlist_id) {
        return res.status(400).json({ success: false, message: "Missing data" });
    }

    if (!title && !cover) {
        return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    try {
        const result = await Playlist.updateUserPlaylist(user_id, playlist_id, title, cover);

        if (!result.success) {
            return res.status(403).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error("Error updating playlist:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    getPlaylistById, searchPlaylists, getPlaylists, createPlaylistUser, getUserPlaylists,
    removeUserPlaylist, getLikedPlaylists, deleteUserPlaylist, updateUserPlaylist
};
