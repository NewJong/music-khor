import { fetchData } from "@/lib/fetchData";
import { usePlayerStore } from "@/store/playerStore";
import { PlayIcon, PauseIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export default function CardPlayButton({ playlistId, size = "small" }) {
  const { isPlaying, currentMusic, setIsPlaying, setCurrentMusic } =
    usePlayerStore((state) => state);

  const [isThisPlaylistInStore, setIsThisPlaylistInStore] = useState(false);

  useEffect(() => {
    setIsThisPlaylistInStore(currentMusic?.playlistId === playlistId);
  }, [currentMusic, playlistId]);

  const isPlayingPlaylist = isPlaying && isThisPlaylistInStore;

  const handleClick = async () => {
    if (isThisPlaylistInStore) {
      setIsPlaying(!isPlaying);
      return;
    }

    try {
      const data = await fetchData("get-playlists");
      const playlists = Array.isArray(data) ? data : [];
      const playlist = playlists.find((p) => p.id == playlistId);

      if (!playlist || !playlist.songs || playlist.songs.length === 0) return;
      setCurrentMusic({
        playlistId: playlistId,
        song: playlist.songs[0],
        songs: playlist.songs,
      });
      setIsPlaying(true);
    } catch (error) {
      console.error("Error loading playlist:", error);
    }
  };

  const iconClassName = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-5 h-5",
  }[size];

  const buttonPadding = {
    small: "p-3",
    medium: "p-3",
    large: "p-4",
  }[size];

  const commonButtonClasses =
    "rounded-full text-black bg-green-500 hover:scale-105 transition duration-300 ease-in-out hover:translate-y-[-2px]";

  return (
    <button
      onClick={handleClick}
      className={`${commonButtonClasses} ${buttonPadding}`}
    >
      {isPlayingPlaylist ? (
        <PauseIcon className={iconClassName} />
      ) : (
        <PlayIcon className={iconClassName} />
      )}
    </button>
  );
}
