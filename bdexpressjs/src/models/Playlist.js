const db = require('../db');

const SONGS_AGG = `COALESCE(
    json_agg(
        json_build_object(
            'id', s.id,
            'title', s.title,
            'artists', s.artists,
            'file_path', s.file_path,
            'duration', s.duration,
            'image', s.image,
            'album', s.album
        ) ORDER BY s.id
    ) FILTER (WHERE s.id IS NOT NULL),
    '[]'::json
) AS songs`;

const SONGS_JOIN = `LEFT JOIN playlist_songs ps ON ps.playlist_id = p.id
                    LEFT JOIN songs s ON s.id = ps.song_id`;

class Playlist {
    static async getById(id) {
        const { rows } = await db.query(
            `SELECT p.*, ${SONGS_AGG}
             FROM playlists p
             ${SONGS_JOIN}
             WHERE p.id = $1
             GROUP BY p.id`,
            [id]
        );
        return rows[0] || null;
    }

    static async search(q) {
        const sql = `
            SELECT 'Playlist' AS type, id, title, cover, NULL AS playlist_id, artists
            FROM playlists
            WHERE (title ILIKE $1 OR artists ILIKE $1) AND type = 'default'
            UNION
            SELECT 'Song' AS type, s.id, s.title, s.image AS cover, ps.playlist_id, s.artists
            FROM songs s
            JOIN playlist_songs ps ON ps.song_id = s.id
            JOIN playlists p ON p.id = ps.playlist_id
            WHERE (s.title ILIKE $1 OR s.artists ILIKE $1) AND p.type = 'default'
            LIMIT 5
        `;
        const { rows } = await db.query(sql, [`%${q}%`]);
        return rows;
    }

    static async getAll(includeLiked = true, genre = null) {
        const params = [];
        const conditions = [];

        if (!includeLiked) {
            conditions.push("p.type <> 'liked'");
        }

        if (genre) {
            params.push(genre);
            conditions.push(`p.genre = $${params.length}`);
        }

        const whereClause = conditions.length > 0
            ? 'WHERE ' + conditions.join(' AND ')
            : '';

        const query = `
            SELECT p.*, ${SONGS_AGG}
            FROM playlists p
            ${SONGS_JOIN}
            ${whereClause}
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `;

        const { rows } = await db.query(query, params);
        return rows;
    }

    static async createUserPlaylist(title, artists, cover) {
        const { rows } = await db.query(
            `INSERT INTO playlists (title, type, artists, cover)
             VALUES ($1, 'liked', $2, $3)
             RETURNING id`,
            [title, artists, cover || null]
        );

        return rows[0]?.id || null;
    }

    static async getUserPlaylists(email) {
        const { rows } = await db.query(
            `SELECT p.*,
                    up.created_at AS user_playlist_created_at,
                    ${SONGS_AGG}
             FROM users u
             JOIN user_playlists up ON up.user_id = u.id
             JOIN playlists p ON p.id = up.playlist_id
             ${SONGS_JOIN}
             WHERE u.email = $1
             GROUP BY p.id, up.created_at
             ORDER BY
                 CASE WHEN p.title = 'Music you liked' THEN 0 ELSE 1 END,
                 up.created_at ASC`,
            [email]
        );

        return rows;
    }

    static async getLikedPlaylists(user_id) {
        const { rows } = await db.query(
            `SELECT p.id, p.title FROM playlists p
             JOIN user_playlists up ON up.playlist_id = p.id
             WHERE up.user_id = $1 AND p.type = 'liked'`,
            [user_id]
        );
        return rows;
    }

    static async deleteUserPlaylist(userId, playlistId) {
        const { rows: playlist } = await db.query(
            `SELECT p.title FROM playlists p
             JOIN user_playlists up ON p.id = up.playlist_id
             WHERE up.user_id = $1 AND up.playlist_id = $2 AND p.type = 'liked'`,
            [userId, playlistId]
        );

        if (playlist.length === 0) {
            return { success: false, message: "Playlist not found or access denied" };
        }

        await db.query(
            'DELETE FROM user_playlists WHERE user_id = $1 AND playlist_id = $2',
            [userId, playlistId]
        );

        const { rowCount } = await db.query(
            'DELETE FROM playlists WHERE id = $1',
            [playlistId]
        );

        return { success: rowCount > 0, message: "Playlist deleted" };
    }

    static async updateUserPlaylist(userId, playlistId, newTitle, newCover) {
        const { rows: playlist } = await db.query(
            `SELECT p.title, p.cover FROM playlists p
             JOIN user_playlists up ON p.id = up.playlist_id
             WHERE up.user_id = $1 AND up.playlist_id = $2 AND p.type = 'liked'`,
            [userId, playlistId]
        );

        if (playlist.length === 0) {
            return { success: false, message: "Playlist not found or access denied" };
        }

        const updatedTitle = newTitle ? newTitle : playlist[0].title;
        const updatedCover = newCover ? newCover : playlist[0].cover;

        const { rowCount } = await db.query(
            'UPDATE playlists SET title = $1, cover = $2 WHERE id = $3',
            [updatedTitle, updatedCover, playlistId]
        );

        return { success: rowCount > 0, message: "Playlist updated" };
    }
}

module.exports = Playlist;
