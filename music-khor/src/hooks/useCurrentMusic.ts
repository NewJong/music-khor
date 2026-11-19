import { CurrentMusic, Song } from "@/store/playerStore";

export default function useCurrentMusic(currentMusic: CurrentMusic) {
  const getCurrentSongIndex = (): number => {
    if (!currentMusic.song) return -1;
    return currentMusic.songs.findIndex(
      (song: Song) => song.id === currentMusic.song!.id
    );
  };

  const getNextSong = (): Song | null => {
    const index = getCurrentSongIndex();
    if (index === -1 || index + 1 >= currentMusic.songs.length) {
      return null;
    }
    return currentMusic.songs[index + 1];
  };

  const getPreviousSong = (): Song | null => {
    const index = getCurrentSongIndex();
    if (index <= 0) {
      return null;
    }
    return currentMusic.songs[index - 1];
  };

  return { getCurrentSongIndex, getNextSong, getPreviousSong };
}
