import CardPlayButton from "@/components/Buttons/CardPlayButton";
import { usePlayerStore } from "@/store/playerStore";
import { truncate } from "@/lib/utils";

export default function SidebarCard({ playlist }) {
  const { id, cover, title, artists } = playlist;
  const currentPlaylistId = usePlayerStore(
    (state) => state.currentMusic.playlistId
  );
  const isPlayingPlaylist = id == currentPlaylistId;
  return (
    <a
      href={`/playlist/${id}`}
      className="group playlist-item flex relative p-2 items-center gap-3 lg:gap-4 rounded-md 
      hover:bg-zinc-800 transition-all duration-300 ease-in-out lg:hover:translate-x-2"
    >
      <picture className="h-12 w-12 flex-none ml-1">
        <img
          src={cover}
          alt={`Cover of ${title} by ${artists}`}
          className="object-cover w-full h-full rounded-md"
        />
      </picture>

      <div className="flex flex-auto flex-col truncate">
        <h4
          className={`text-sm ${
            isPlayingPlaylist ? "text-green-500" : "text-white"
          }`}
        >
          {truncate(title, 30)}
        </h4>
        <span className="text-xs text-gray-400">{truncate(artists, 30)}</span>
      </div>
      <div
        className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2
        opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 mr-1"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <CardPlayButton playlistId={id} size="small" />
      </div>
    </a>
  );
}
