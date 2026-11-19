import { useEffect, useRef, useState } from "react";
import PlaylistItem from "@/components/Card/PlaylistItem";
import { fetchData } from "@/lib/fetchData";

interface Playlist {
  id: number;
  title: string;
  cover?: string;
  [key: string]: any;
}

export default function FlyingPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [isMedium, setIsMedium] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const velocitiesRef = useRef<{ x: number; y: number; stopped: boolean }[]>(
    []
  );

  useEffect(() => {
    const loadPlaylists = async () => {
      const query = selectedGenre === "All" ? "" : `&genre=${selectedGenre}`;
      const data = await fetchData(`get-playlists?include_liked=0${query}`);
      const playlists = data.slice(0, 7);
      setPlaylists(playlists || []);
    };
    loadPlaylists();
  }, [selectedGenre]);

  useEffect(() => {
    const handleResize = () => {
      setIsMedium(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMedium || !containerRef.current || playlists.length === 0) return;

    const items = Array.from(
      containerRef.current.querySelectorAll<HTMLDivElement>(
        ".playlist-item-wrapper"
      )
    );
    const itemSize = 270;

    const isColliding = (rect1: DOMRect, rect2: DOMRect) => {
      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
    };

    const setInitialPosition = () => {
      const existingItems: DOMRect[] = [];
      items.forEach((item) => {
        let isOverlap;
        let attempts = 0;
        do {
          const left =
            Math.random() * (containerRef.current?.offsetWidth! - itemSize);
          const top =
            Math.random() * (containerRef.current?.offsetHeight! - itemSize);
          item.style.left = `${left}px`;
          item.style.top = `${top}px`;

          const rect = item.getBoundingClientRect();
          isOverlap = existingItems.some((existingRect) =>
            isColliding(rect, existingRect)
          );
          attempts++;
        } while (isOverlap && attempts < 100);

        if (attempts < 100) {
          existingItems.push(item.getBoundingClientRect());
        }
      });

      velocitiesRef.current = items.map(() => ({
        x: (Math.random() * 0.5 + 0.4) * (Math.random() < 0.5 ? 1 : -1),
        y: (Math.random() * 0.5 + 0.4) * (Math.random() < 0.5 ? 1 : -1),
        stopped: false,
      }));
    };

    setInitialPosition();

    const handleResize = () => {
      setInitialPosition();
    };

    window.addEventListener("resize", handleResize);

    items.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        velocitiesRef.current[index].stopped = true;
      });

      item.addEventListener("mouseleave", () => {
        velocitiesRef.current[index].stopped = false;
        velocitiesRef.current[index].x =
          (Math.random() * 0.5 + 0.4) * (Math.random() < 0.5 ? 1 : -1);
        velocitiesRef.current[index].y =
          (Math.random() * 0.5 + 0.4) * (Math.random() < 0.5 ? 1 : -1);
      });
    });

    const update = () => {
      items.forEach((item, index) => {
        const velocity = velocitiesRef.current[index];
        if (velocity.stopped) return;

        let left = parseFloat(item.style.left);
        let top = parseFloat(item.style.top);
        const rect = item.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();

        if (
          rect.right >= containerRect.right ||
          rect.left <= containerRect.left
        ) {
          velocity.x *= -1;
        }
        if (
          rect.bottom >= containerRect.bottom ||
          rect.top <= containerRect.top
        ) {
          velocity.y *= -1;
        }

        items.forEach((otherItem, otherIndex) => {
          if (index !== otherIndex) {
            const otherRect = otherItem.getBoundingClientRect();
            if (isColliding(rect, otherRect)) {
              const otherVelocity = velocitiesRef.current[otherIndex];
              if (!otherVelocity.stopped) {
                [velocity.x, otherVelocity.x] = [otherVelocity.x, velocity.x];
                [velocity.y, otherVelocity.y] = [otherVelocity.y, velocity.y];
              } else {
                velocity.x *= -1;
                velocity.y *= -1;
              }
            }
          }
        });

        item.style.left = `${left + velocity.x}px`;
        item.style.top = `${top + velocity.y}px`;
      });

      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [playlists, isMedium]);

  const genres = [
    "All",
    "Rock",
    "Disco",
    "Jazz",
    "Hip-Hop",
    "Classical",
    "Nu Metal",
    "Soul",
    "Relax",
    "Funk",
    "Pop",
  ];

  return (
    <>
      <div className="text-white pt-6 mx-6 mb-8 md:mb-0">
        <div className="flex justify-center flex-wrap gap-4 lg:gap-8">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`w-24 h-12 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors 
                shadow-xl
                hover:scale-105 ${
                  selectedGenre === genre ? "text-green-400" : "text-white"
                }`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
      <div
        id="playlist-cont"
        ref={containerRef}
        className={`relative z-10 overflow-hidden
        h-[calc(100vh-1vh)] md:h-[calc(100vh-29vh)] lg:h-[calc(100vh-28vh)]
        ${isMedium ? "flex flex-col gap-4" : ""}`}
      >
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={`${
              isMedium
                ? "mx-8 w-76"
                : "playlist-item-wrapper absolute w-[270px]"
            }`}
          >
            <PlaylistItem playlist={playlist} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 -z-[1]"></div>
      </div>
    </>
  );
}
