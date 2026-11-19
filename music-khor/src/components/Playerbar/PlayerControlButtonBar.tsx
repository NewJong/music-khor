import { usePlayerStore } from "@/store/playerStore";
import useCurrentMusic from "@/hooks/useCurrentMusic";
import {
  PauseIcon,
  PlayIcon,
  TrackPreviousIcon,
  TrackNextIcon,
} from "@radix-ui/react-icons";

export default function PlayerControlButtonBar() {
  const { currentMusic, isPlaying, setIsPlaying, setCurrentMusic } =
    usePlayerStore((state) => state);
  const { getNextSong, getPreviousSong } = useCurrentMusic(currentMusic);

  const onPlayPause = () => {
    if (!currentMusic.song) return;
    setIsPlaying(!isPlaying);
  };

  const onNextSong = () => {
    if (currentMusic.songs.length === 0) return;
    let nextSong = getNextSong();
    if (!nextSong) {
      nextSong = currentMusic.songs[0];
    }
    if (nextSong) {
      setCurrentMusic({ ...currentMusic, song: nextSong });
      setIsPlaying(true);
    }
  };

  const onPrevSong = () => {
    if (currentMusic.songs.length === 0) return;
    let prevSong = getPreviousSong();
    if (!prevSong) {
      prevSong = currentMusic.songs[currentMusic.songs.length - 1];
    }
    if (prevSong) {
      setCurrentMusic({ ...currentMusic, song: prevSong });
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 sm:gap-3">
      <button
        className="hover:scale-110 transition-transform"
        onClick={onPrevSong}
        title="Previous song"
      >
        <TrackPreviousIcon className="" />
      </button>
      <button
        className="bg-white text-black rounded-full p-2 hover:scale-110 transition-transform"
        onClick={onPlayPause}
        title="Pause/Play"
      >
        {isPlaying ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </button>
      <button
        className="hover:scale-110 transition-transform"
        onClick={onNextSong}
        title="Next song"
      >
        <TrackNextIcon className="" />
      </button>
    </div>
  );
}
