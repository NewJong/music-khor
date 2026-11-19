ALTER TABLE users DISABLE TRIGGER trg_after_user_insert;

INSERT INTO users (id, email, name, is_admin) VALUES
    (1,  'admin@example.com',        'Admin',          1),
    (10, 'user@example.com',         'Demo User',      0);

INSERT INTO playlists (id, title, cover, artists, type, created_at, genre) VALUES
    (1,  'Music you liked',     '/photo/like.png',                                'Created automatically', 'liked',   '2025-03-23 13:41:08', NULL),
    (3,  'House of Wolves',     '/songsPhoto/HouseofWolves.jpg',                  'My Chemical Romanceomance', 'default', '2025-03-23 08:41:08', 'Rock'),
    (4,  'The Works',           '/songsPhoto/QueenTheWorks.jpg',                  'Queen',                   'default', '2025-03-23 09:41:08', 'Rock'),
    (5,  'Love At First Sting', '/songsPhoto/ScorpionsLoveAtFirstSting.jpg',      'Scorpions',               'default', '2025-03-23 10:41:08', 'Rock'),
    (6,  'Infest',              '/songsPhoto/PapaRoachInfest.jpg',                'Papa Roach',              'default', '2025-03-23 11:41:08', 'Nu Metal'),
    (7,  'Cheek To Cheek',      '/songsPhoto/TonyBennettLadyGagaCheekToCheek.jpg','Tony Bennett, Lady Gaga', 'default', '2025-03-23 11:41:08', 'Jazz'),
    (8,  'Back In Black',       '/songsPhoto/ACDCBackInBlack.png',                'AC/DC',                   'default', '2025-03-23 14:41:08', 'Rock'),
    (9,  'American Idiot',      '/songsPhoto/GreenDayAmericanIdiotCover.jpg',     'Green Day',               'default', '2025-03-23 07:41:08', 'Rock'),
    (10, 'Toxicity',            '/songsPhoto/SystemOfADown.jpg',                  'System Of A Down',        'default', '2025-03-23 13:41:08', 'Nu Metal'),
    (51, 'Music you liked',     '/photo/like.png',                                'Created automatically',   'liked',   '2025-03-24 22:59:58', NULL),
    (53, 'My playlist',         '/photo/playlist.png',                            'Demo User',               'liked',   '2025-03-26 19:07:15', NULL);

INSERT INTO songs (id, title, artists, file_path, duration, image, album) VALUES
    (1, 'Rock and Roll Ain''t Noise Pollution', 'AC/DC',           '/songs/ACDC/ACDCRockAndRollAin''tNoisePollution.mp3', 250, '/songsPhoto/ACDCBackInBlack.png',            'Back In Black'),
    (2, 'Back In Black',                        'AC/DC',           '/songs/ACDC/ACDCBackInBlack.mp3',                     255, '/songsPhoto/ACDCBackInBlack.png',            'Back In Black'),
    (3, 'American Idiot',                       'Green Day',       '/songs/GreenDay/AmericanIdiot.mp3',                   174, '/songsPhoto/GreenDayAmericanIdiotCover.jpg', 'American Idiot'),
    (4, 'Attack',                               'System of a Down','/songs/SystemOfADown/Attack.mp3',                     186, '/songsPhoto/SystemOfADown.jpg',              'Toxicity');

INSERT INTO user_playlists (id, user_id, playlist_id, created_at) VALUES
    (193, 1,  1,  '2025-03-03 00:18:33'),
    (366, 10, 51, '2025-03-24 22:59:58'),
    (376, 1,  53, '2025-03-26 19:07:15'),
    (380, 1,  9,  '2025-03-31 18:42:33');

INSERT INTO playlist_songs (playlist_id, song_id) VALUES
    (1, 1),
    (8, 1),
    (1, 2),
    (8, 2),
    (9, 3);

ALTER TABLE users ENABLE TRIGGER trg_after_user_insert;

SELECT setval(pg_get_serial_sequence('users', 'id'),
              (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval(pg_get_serial_sequence('playlists', 'id'),
              (SELECT COALESCE(MAX(id), 1) FROM playlists));
SELECT setval(pg_get_serial_sequence('songs', 'id'),
              (SELECT COALESCE(MAX(id), 1) FROM songs));
SELECT setval(pg_get_serial_sequence('user_playlists', 'id'),
              (SELECT COALESCE(MAX(id), 1) FROM user_playlists));
