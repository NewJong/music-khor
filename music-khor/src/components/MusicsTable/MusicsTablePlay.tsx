import { useEffect, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";

export default function MusicsTablePlay({ song, songs = [], playlistId }) {
  const { isPlaying, currentMusic, setIsPlaying, setCurrentMusic } =
    usePlayerStore((state) => state);

  const [isCurrentSong, setIsCurrentSong] = useState(false);

  useEffect(() => {
    const sameSong = String(currentMusic.song?.id) === String(song.id);
    const samePlaylist = String(currentMusic.playlistId) === String(playlistId);
    setIsCurrentSong(sameSong && samePlaylist);
  }, [currentMusic, song, playlistId]);

  const handleClick = () => {
    if (isCurrentSong) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentMusic({
        playlistId,
        song,
        songs,
      });
      setIsPlaying(true);
    }
  };

  const className =
    "w-5 h-5 hover:scale-125 hover:text-green-500 transition duration-300 ease-in-out hover:translate-y-[-2px]";

  return (
    <button className="text-white" onClick={handleClick}>
      {isCurrentSong && isPlaying ? (
        <PauseIcon className={className} />
      ) : (
        <PlayIcon className={className} />
      )}
    </button>
  );
}
