import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import { fetchData } from "@/lib/fetchData";
import AuthAlertDialog from "@/components/Login/AuthAlertDialog";
import Dialog from "@/components/ui/Dialog";
export default function CreatePlaylistButton() {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : "";
  const userDisplayName =
    typeof window !== "undefined"
      ? localStorage.getItem("userDisplayName")
      : "";

  const handleCreate = async () => {
    if (!userEmail) {
      setIsAuthDialogOpen(true);
      return;
    }

    const playlistData = {
      title: title.trim(),
      artists: userDisplayName,
      email: userEmail,
      cover: cover.trim() || "/photo/playlist.png",
    };

    try {
      const response = await fetchData(
        "create-playlist-user",
        "POST",
        playlistData
      );
      if (response && response.success) {
        window.dispatchEvent(new Event("playlistCreated"));
      } else {
        console.error("Error creating playlist:", response);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
    setTitle("");
    setCover("");
    setIsCreateDialogOpen(false);
  };

  return (
    <>
      <button
        className="flex items-center space-x-2 text-white hover:scale-110 hover:text-green-500
        transition duration-300 ease-in-out hover:rotate-90"
        title="Create new playlist"
        onClick={() => {
          if (!userEmail) {
            setIsAuthDialogOpen(true);
          } else {
            setIsCreateDialogOpen(true);
          }
        }}
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Create playlist"
      >
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Playlist name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 rounded-md bg-gray-800 border border-gray-600"
          />
          <input
            type="text"
            placeholder="Link to cover (optional)"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className="p-2 rounded-md bg-gray-800 border border-gray-600"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <AlertDialog.Cancel asChild>
            <button className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500">
              Cancel
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button
              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500"
              onClick={handleCreate}
              disabled={!title.trim()}
            >
              Create
            </button>
          </AlertDialog.Action>
        </div>
      </Dialog>

      <AuthAlertDialog
        open={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </>
  );
}
