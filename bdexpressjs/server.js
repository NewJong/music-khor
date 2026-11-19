require('dotenv').config();
const express = require('express');
const cors = require('cors');

const playlistRoutes = require('./src/routes/playlistsRoutes');
const userRoutes = require('./src/routes/userRoutes');
const userPlaylistRoutes = require('./src/routes/userPlaylistRoutes');
const playlistSongsRoutes = require('./src/routes/playlistSongsRoutes');

const app = express();
const port = process.env.PORT || 4444;
app.use(cors({ origin: '*' })); 
app.use(express.json());

const baseRouter = express.Router();

baseRouter.use(userRoutes);
baseRouter.use(playlistRoutes);
baseRouter.use(userPlaylistRoutes);
baseRouter.use(playlistSongsRoutes);

app.use('/bdmusic', baseRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
