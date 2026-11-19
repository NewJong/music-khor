import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { fetchData } from "@/lib/fetchData";
import { getUserEmail } from "@/lib/auth";
import { truncate } from "@/lib/utils";
import AuthAlertDialog from "@/components/Login/AuthAlertDialog";
import Dialog from "@/components/ui/Dialog";

export default function SongLikeButton({ songId }) {
  const [playlists, setPlaylists] = useState([]);
  const [playlistStates, setPlaylistStates] = useState({});
  const [isLikeSongDialogOpen, setIsLikeSongDialogOpen] = useState(false);

  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const email = getUserEmail();

  useEffect(() => {
    if (!email) return;

    async function fetchLikedPlaylistsAndStates() {
      const playlistsData = await fetchData(
        `get-liked-playlists?email=${encodeURIComponent(email)}`
      );
      setPlaylists(playlistsData || []);

      const states = {};
      for (const pl of playlistsData) {
        const result = await fetchData(
          `check-song?playlistId=${pl.id}&songId=${songId}`
        );
        states[pl.id] = result && result.found;
      }
      setPlaylistStates(states);
    }
    fetchLikedPlaylistsAndStates();
  }, [songId, email]);

  const handleCheckboxChange = (playlistId) => {
    setPlaylistStates((prev) => ({
      ...prev,
      [playlistId]: !prev[playlistId],
    }));
  };

  const handleSave = async () => {
    if (!email) return;

    for (const pl of playlists) {
      const shouldHave = playlistStates[pl.id];
      const result = await fetchData(
        `check-song?playlistId=${pl.id}&songId=${songId}`
      );
      const isPresent = result && result.found;

      if (shouldHave && !isPresent) {
        await fetchData("add-to-liked-playlist", "POST", {
          email,
          songId,
          playlistId: pl.id,
        });
      } else if (!shouldHave && isPresent) {
        await fetchData("remove-from-liked-playlist", "DELETE", {
          email,
          songId,
          playlistId: pl.id,
        });
      }
    }
    setIsLikeSongDialogOpen(false);
  };

  const handleButtonClick = () => {
    if (!email) {
      setIsAuthDialogOpen(true);
    } else {
      setIsLikeSongDialogOpen(true);
    }
  };

  const isLiked = Object.values(playlistStates).some((state) => state === true);

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="sm:group-hover:opacity-100 opacity-100 transition-opacity"
      >
        {isLiked ? (
          <HeartFilledIcon className="text-[#FF4D6D] w-6 h-6 hover:scale-110" />
        ) : (
          <HeartIcon className="w-6 h-6 hover:scale-110 hover:text-red-500" />
        )}
      </button>

      {email && (
        <Dialog
          open={isLikeSongDialogOpen}
          onOpenChange={setIsLikeSongDialogOpen}
          title="Manage songs in playlists"
        >
          <div className="mt-4 space-y-2">
            {playlists.map((pl) => (
              <div key={pl.id} className="flex items-center gap-2">
                <button
                  onClick={() => handleCheckboxChange(pl.id)}
                  className="focus:outline-none"
                >
                  {playlistStates[pl.id] ? (
                    <HeartFilledIcon className="text-[#FF4D6D] w-5 h-5 hover:scale-110" />
                  ) : (
                    <HeartIcon className="w-5 h-5 hover:scale-110 hover:text-red-500" />
                  )}
                </button>
                <span>{truncate(pl.title, 35)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500"
            >
              Save
            </button>
          </div>
        </Dialog>
      )}

      <AuthAlertDialog
        open={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </>
  );
}
