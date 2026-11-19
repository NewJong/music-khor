const db = require('../db');

class PlaylistSongs {
    static async addSongToLikedPlaylist(playlist_id, song_id) {
        if (await this.checkSongInPlaylist(playlist_id, song_id)) return false;

        await db.query(
            'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)',
            [playlist_id, song_id]
        );

        return true;
    }

    static async removeSongFromLikedPlaylist(playlist_id, song_id) {
        const { rowCount } = await db.query(
            'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
            [playlist_id, song_id]
        );

        return rowCount > 0;
    }

    static async checkSongInPlaylist(playlist_id, song_id) {
        const { rows } = await db.query(
            'SELECT 1 FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
            [playlist_id, song_id]
        );

        return rows.length > 0;
    }
}

module.exports = PlaylistSongs;
