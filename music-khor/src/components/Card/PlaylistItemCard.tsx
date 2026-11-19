import AddToPlaylistButton from "@/components/Buttons/AddPlaylistButton";
import CardPlayButton from "@/components/Buttons/CardPlayButton";
import { truncate } from "@/lib/utils";

export default function PlaylistItemCard({ playlist }) {
  const { id, cover, title, artists, type } = playlist;

  return (
    <article
      className="group relative hover:bg-zinc-800 shadow-xl hover:shadow-xl bg-zinc-500/30
    rounded-md transition-all duration-300 hover:translate-y-[-5px]"
    >
      <div
        className="absolute right-4 bottom-20 lg:translate-y-4 transition-all duration-500 lg:opacity-0
    lg:group-hover:translate-y-0 lg:group-hover:opacity-100 z-[10] flex flex-col items-end gap-2"
      >
        {type !== "liked" ? (
          <AddToPlaylistButton playlistId={id} />
        ) : (
          <CardPlayButton playlistId={id} size="medium" />
        )}
      </div>
      <a
        href={`/playlist/${id}`}
        className="playlist-item transition-all duration-300 flex relative p-2 overflow-hidden gap-2
        pb-6 rounded-md w-36 s550:w-44 flex-col"
      >
        <picture className="aspect-square w-full h-auto flex-none">
          <img
            src={cover}
            alt={`Cover of ${title} by ${artists}`}
            className="object-cover w-full h-full rounded-md"
          />
        </picture>

        <div className="flex flex-auto flex-col px-2">
          <h4 className="text-white text-sm">{truncate(title, 16)}</h4>
          <span className="text-xs text-gray-400 hover:underline">
            {truncate(artists, 16)}
          </span>
        </div>
      </a>
    </article>
  );
}
