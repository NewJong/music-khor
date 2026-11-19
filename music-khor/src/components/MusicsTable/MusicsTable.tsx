import { ClockIcon } from "@radix-ui/react-icons";
import MusicsTablePlay from "@/components/MusicsTable/MusicsTablePlay";
import { usePlayerStore } from "@/store/playerStore";
import SongLikeButton from "../Buttons/SongLikeButton";
import { useEffect, useState } from "react";
import { truncate, formatDuration } from "@/lib/utils";

export default function MusicTable({ songs, playlistId }) {
  const { currentMusic } = usePlayerStore((state) => state);

  const [currentSongId, setCurrentSongId] = useState<number | null>(null);

  useEffect(() => {
    if (currentMusic.song?.id && currentMusic.playlistId === playlistId) {
      setCurrentSongId(currentMusic.song.id);
    } else {
      setCurrentSongId(null);
    }
  }, [currentMusic, playlistId]);

  return (
    <>
      <table className="table-auto text-left min-w-full divide-y divide-gray-500/20 ">
        <thead>
          <tr className="text-zinc-400 text-sm">
            <th className="px-4 py-1 xs:px-3 xs:py-2 font-light">№</th>
            <th className="py-1 xs:px-4 xs:py-2 font-light">Name</th>
            <th className="px-2 py-1 xs:px-4 xs:py-2 font-light hidden sm:table-cell">
              Album
            </th>
            <th className="px-4 py-2 font-light hidden sm:table-cell">
              <ClockIcon className="text-zinc-400 w-5 h-5" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="h-[16px]"></tr>
          {songs.map((song, index) => {
            const current = currentSongId === song.id;
            return (
              <tr
                key={song.id}
                className={`text-gray-300 border-spacing-0 text-sm font-light
                     hover:bg-white/10 overflow-hidden transition duration-300 group cursor-pointer
                     ${current ? "bg-white/5" : ""}`}
              >
                <td className="relative px-4 py-2 rounded-tl-lg rounded-bl-lg w-5">
                  <span
                    className={`absolute top-5 transition-all ${
                      current
                        ? "opacity-0"
                        : "opacity-100 group-hover:opacity-0"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div
                    className={`absolute top-5 transition-all ${
                      current
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <MusicsTablePlay
                      song={song}
                      songs={songs}
                      playlistId={playlistId}
                    />
                  </div>
                </td>
                <td className="py-2 xs:px-4 xs:py-2 flex gap-3">
                  <picture>
                    <img
                      src={song.image}
                      alt={song.title}
                      className="w-11 h-11 rounded-md"
                    />
                  </picture>
                  <div className="flex flex-col">
                    <h3
                      className={`text-base font-normal truncate ${
                        current ? "text-green-400" : "text-white"
                      }`}
                    >
                      <span className="md:hidden">
                        {truncate(song.title, 20)}
                      </span>

                      <span className="hidden md:inline">{song.title}</span>
                    </h3>
                    <span className="hover:underline text-xs sm:text-sm">
                      <span className="sm:hidden">
                        {truncate(song.artists, 20)}
                      </span>
                      <span className="hidden sm:inline">{song.artists}</span>
                      <span className="sm:hidden text-xs text-gray-400">
                        {" "}
                        - {formatDuration(song.duration)}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="text-xs sm:text-sm xs:px-4 xs:py-2 hidden sm:table-cell">
                  {song.album}
                </td>

                <td className="xs:px-4 xs:py-2 rounded-tr-lg rounded-br-lg">
                  <div className="relative">
                    <span className="hidden sm:block transition-opacity duration-300 group-hover:opacity-0">
                      {formatDuration(song.duration)}
                    </span>
                    <div
                      className={`sm:absolute sm:inset-0 sm:flex sm:items-center 
                    sm:transition-opacity duration-500 sm:opacity-0 group-hover:opacity-100
                    mr-3 xs:mr-0 ${current ? "opacity-100" : "opacity-0"}`}
                    >
                      <SongLikeButton songId={song.id} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
