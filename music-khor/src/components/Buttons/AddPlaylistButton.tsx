import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { fetchData } from "@/lib/fetchData";
import { getUserEmail, getCurrentUserId } from "@/lib/auth";
import AuthAlertDialog from "@/components/Login/AuthAlertDialog";

export default function AddToPlaylistButton({
  playlistId,
  size = "small",
  option = "card",
}) {
  const [isAdded, setIsAdded] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const checkPlaylist = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const response = await fetchData(
        `check-user-playlist?user_id=${userId}&playlist_id=${playlistId}`
      );
      setIsAdded(response.exists);
    } catch (error) {
      console.error("Error check playlist", error);
    }
  };

  useEffect(() => {
    checkPlaylist();
  }, [playlistId]);

  useEffect(() => {
    const handleEmailChange = () => {
      checkPlaylist();
    };

    window.addEventListener("userEmailChanged", handleEmailChange);
    return () => {
      window.removeEventListener("userEmailChanged", handleEmailChange);
    };
  }, []);

  const handleTogglePlaylist = async () => {
    if (!getUserEmail()) {
      setIsAuthDialogOpen(true);
      return;
    }

    try {
      const userId = await getCurrentUserId();
      if (!userId) return;

      let result: { success: boolean; message: string };

      if (isAdded) {
        result = await fetchData("remove-user-playlist", "DELETE", {
          user_id: userId,
          playlist_id: playlistId,
        });
      } else {
        result = await fetchData("add-user-playlist", "POST", {
          user_id: userId,
          playlist_id: playlistId,
        });
      }

      if (result.success) {
        setIsAdded(
          result.message !== "Playlist already added" &&
            result.message !== "Playlist deleted"
        );

        const event = new CustomEvent("userEmailChanged");
        window.dispatchEvent(event);
      } else {
        console.error("Error processing playlist");
      }
    } catch (error) {
      console.error("Error processing playlist", error);
    }
  };

  const iconClassName = size === "small" ? "w-5 h-5" : "w-8 h-8";
  const optionName =
    option === "card"
      ? "rounded-full text-red-500 bg-green-500 p-3 hover:scale-105 transition hover:bg-green-400"
      : "rounded-full text-[#FF4D6D] hover:scale-110 transition hover:translate-y-[-2px]";
  return (
    <>
      <button onClick={handleTogglePlaylist} className={optionName}>
        {isAdded ? (
          <HeartFilledIcon className={iconClassName} />
        ) : (
          <HeartIcon className={iconClassName} />
        )}
      </button>
      <AuthAlertDialog
        open={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </>
  );
}
