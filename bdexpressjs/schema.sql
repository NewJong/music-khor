DROP TABLE IF EXISTS playlist_songs CASCADE;
DROP TABLE IF EXISTS user_playlists CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS songs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    name        VARCHAR(255),
    is_admin    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE playlists (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    cover       VARCHAR(255),
    artists     VARCHAR(255) NOT NULL,
    type        VARCHAR(16) NOT NULL DEFAULT 'default'
                CHECK (type IN ('default', 'liked')),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    genre       VARCHAR(255)
);

CREATE TABLE songs (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    artists     VARCHAR(255),
    file_path   VARCHAR(255) NOT NULL,
    duration    INTEGER,
    image       VARCHAR(255) NOT NULL,
    album       VARCHAR(255)
);

CREATE TABLE user_playlists (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id)     ON DELETE CASCADE,
    playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, playlist_id)
);

CREATE TABLE playlist_songs (
    playlist_id INTEGER NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    song_id     INTEGER NOT NULL REFERENCES songs(id)     ON DELETE CASCADE,
    PRIMARY KEY (playlist_id, song_id)
);

CREATE OR REPLACE FUNCTION after_user_insert() RETURNS TRIGGER AS $$
DECLARE
    new_playlist_id INTEGER;
BEGIN
    INSERT INTO playlists (title, type, artists, cover)
    VALUES ('Music you liked', 'liked', 'Created automatically', '/photo/like.png')
    RETURNING id INTO new_playlist_id;

    INSERT INTO user_playlists (user_id, playlist_id)
    VALUES (NEW.id, new_playlist_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_after_user_insert ON users;
CREATE TRIGGER trg_after_user_insert
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION after_user_insert();
