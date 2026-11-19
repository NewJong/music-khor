import { useState, useEffect } from "react";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import SidebarCard from "@/components/Sidebar/SidebarCard";
import { fetchData } from "@/lib/fetchData";
import CreatePlaylistButton from "@/components/Buttons/CreatePlaylistButton";
import { AnimatePresence, motion } from "framer-motion";
export default function Sidebar() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [email, setEmail] = useState<string | null>(null);

  const loadPlaylists = async (userEmail: string) => {
    const data = await fetchData(
      `get-user-playlists?email=${encodeURIComponent(userEmail)}`
    );
    if (data) {
      setPlaylists(data);
    }
  };
  const setUserEmailCookie = (userEmail: string) => {
    document.cookie = `e=${userEmail}; path=/;`;
  };

  const clearUserEmailCookie = () => {
    document.cookie = `e=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmailCookie(storedEmail);
      setEmail(storedEmail);
      loadPlaylists(storedEmail);
    }
  }, []);

  useEffect(() => {
    const handleUserEmailChange = () => {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        setUserEmailCookie(storedEmail);
        setEmail(storedEmail);
        loadPlaylists(storedEmail);
      } else {
        clearUserEmailCookie();
        setEmail(null);
        setPlaylists([]);
      }
    };

    window.addEventListener("userEmailChanged", handleUserEmailChange);

    return () => {
      window.removeEventListener("userEmailChanged", handleUserEmailChange);
    };
  }, []);

  useEffect(() => {
    const handlePlaylistCreated = () => {
      if (email) {
        loadPlaylists(email);
      }
    };

    window.addEventListener("playlistCreated", handlePlaylistCreated);

    return () => {
      window.removeEventListener("playlistCreated", handlePlaylistCreated);
    };
  }, [email]);

  return (
    <div className="flex flex-col flex-1 gap-2">
      <div className="bg-zinc-900 rounded-lg px-4">
        <ul>
          <SidebarItem href="/" iconName="HomeIcon">
            <span>Home</span>
          </SidebarItem>
          <SidebarItem href="/navigator" iconName="MagnifyingGlassIcon">
            <span>Navigator</span>
          </SidebarItem>
        </ul>
      </div>

      <div className="bg-zinc-900 rounded-lg flex-1 overflow-x-hidden">
        <ul>
          <div className="flex justify-between w-full px-4">
            <SidebarItem href="/library" iconName="ArchiveIcon">
              <span>Library</span>
            </SidebarItem>
            <CreatePlaylistButton />
          </div>
        </ul>

        <ul className="pb-12">
          <AnimatePresence>
            {playlists.map((playlist) => (
              <motion.li
                key={playlist.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SidebarCard playlist={playlist} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
