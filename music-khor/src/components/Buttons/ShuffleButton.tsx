import { ShuffleIcon } from "@radix-ui/react-icons";
import { usePlayerStore } from "@/store/playerStore";

export default function ShuffleButton({ playlistId, songs }) {
  const { setCurrentMusic, setIsPlaying } = usePlayerStore();

  const playShuffledPlaylist = () => {
    if (songs.length === 0) return;
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    setCurrentMusic({ playlistId, song: shuffled[0], songs: shuffled });
    setIsPlaying(true);
  };

  return (
    <button
      className="flex p-2 cursor-pointer hover:bg-zinc-700 w-full text-left hover:rounded-md"
      onClick={playShuffledPlaylist}
    >
      <ShuffleIcon className="w-6 h-6 mr-4" /> Shuffle
    </button>
  );
}
