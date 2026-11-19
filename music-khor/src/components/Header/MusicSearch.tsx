import { useState, useEffect, useRef } from "react";
import { fetchData } from "@/lib/fetchData";
import { ChevronLeftIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
export default function MusicSearch({
  closeSearch,
}: {
  closeSearch?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() !== "") {
      fetchData(`search-playlists?q=${encodeURIComponent(value)}`)
        .then((data) => {
          if (data) {
            setResults(data);
            setShowDropdown(true);
          }
        })
        .catch((error) => console.error("Search error:", error));
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "q") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".music-search-wrapper")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="music-search-wrapper relative flex items-center">
      <div className="relative w-full xs:w-[36vh]">
        <ChevronLeftIcon
          className="s550:hidden absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 
          text-gray-400 cursor-pointer hover:text-white"
          onClick={closeSearch}
        />
        <MagnifyingGlassIcon className="hidden s550:flex absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-white" />

        <input
          ref={inputRef}
          type="text"
          placeholder="Search albums, songs, artists"
          title="CTRL + Q"
          value={search}
          onChange={handleChange}
          className="w-full h-12 pl-10 pr-10 py-2 bg-zinc-900 text-white placeholder-gray-400 
      rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition"
        />
      </div>

      {showDropdown && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 bg-zinc-900 border border-gray-700 
      rounded-lg z-10 max-h-64 overflow-y-auto"
        >
          {results.slice(0, 5).map((item: any) => (
            <a
              key={item.id}
              href={
                item.type === "Playlist"
                  ? `/playlist/${item.id}`
                  : `/playlist/${item.playlist_id}`
              }
              onClick={() => {
                setShowDropdown(false);
                setSearch("");
              }}
              className="flex items-center p-2 gap-4 hover:bg-zinc-700 transition rounded-lg"
            >
              <img
                src={item.cover}
                alt={item.title}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="truncate space-y-1">
                <h4 className="text-gray-300 text-xs font-semibold leading-tight">
                  {item.title}
                </h4>
                <h6 className="text-green-600 text-xs font-medium uppercase leading-none">
                  {item.artists}
                </h6>
                <p className="text-gray-500 text-[11px] tracking-wide">
                  {item.type}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
