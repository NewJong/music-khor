const db = require('../db');

class UserPlaylist {
    static async exists(userId, playlistId) {
        const { rows } = await db.query(
            'SELECT COUNT(*)::int AS count FROM user_playlists WHERE user_id = $1 AND playlist_id = $2',
            [userId, playlistId]
        );
        return rows[0].count > 0;
    }

    static async add(userId, playlistId) {
        const { rowCount } = await db.query(
            'INSERT INTO user_playlists (user_id, playlist_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [userId, playlistId]
        );
        return rowCount > 0;
    }

    static isUserPlaylistExists(userId, playlistId) {
        return this.exists(userId, playlistId);
    }

    static linkUserToPlaylist(userId, playlistId) {
        return this.add(userId, playlistId);
    }

    static async removeUserPlaylist(user_id, playlist_id) {
        const { rowCount } = await db.query(
            'DELETE FROM user_playlists WHERE user_id = $1 AND playlist_id = $2',
            [user_id, playlist_id]
        );

        return rowCount > 0;
    }
}

module.exports = UserPlaylist;
