import CardPlayButton from "@/components/Buttons/CardPlayButton";
import { truncate } from "@/lib/utils";
export default function PlaylistItem({ playlist }) {
  const { id, cover, title, artists } = playlist;

  const handleLinkClick = (event) => {
    if (event.target.closest("button")) {
      event.preventDefault();
    }
  };
  return (
    <a
      href={`/playlist/${id}`}
      className="playlist-item flex group relative transition-all
      duration-300 overflow-hidden items-center gap-3 rounded-md 
      shadow-xl hover:shadow-xl outline-none bg-zinc-700/30 hover:bg-zinc-800 focus:bg-zinc-500/50
      md:hover:translate-y-[-5px]"
      onClick={handleLinkClick}
    >
      <div className="h-20 w-20">
        <img
          src={cover}
          alt={title}
          className="object-cover h-full w-full shadow-[5px_0_30px_0px_rgba(0,0,0,0.3)]"
        />
      </div>
      <div className="font-bold block">
        <h4 className="text-white text-sm">{truncate(title, 15)}</h4>
        <span className="text-xs text-gray-400 hover:underline">
          {truncate(artists, 15)}
        </span>
      </div>
      <div className="absolute right-4 md:opacity-0 group-hover:opacity-100">
        <CardPlayButton playlistId={id} size="medium"></CardPlayButton>
      </div>
    </a>
  );
}
