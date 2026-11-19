import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { fetchData } from "@/lib/fetchData";
import { getCurrentUserId } from "@/lib/auth";
import Dialog from "@/components/ui/Dialog";

export default function EditButton({ playlistId, isOpen, setIsOpen }) {
  const [newTitle, setNewTitle] = useState("");
  const [newCover, setNewCover] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewTitle("");
      setNewCover("");
    }
  }, [isOpen]);

  const updatePlaylist = async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    await fetchData("update-user-playlist", "PUT", {
      user_id: userId,
      playlist_id: playlistId,
      title: newTitle.trim() || undefined,
      cover: newCover.trim() || undefined,
    });
    setIsOpen(false);
    window.dispatchEvent(new Event("playlistCreated"));
  };

  return (
    <>
      <button
        className="flex p-2 cursor-pointer hover:bg-zinc-700 w-full text-left hover:rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <Pencil1Icon className="w-6 h-6 mr-4" /> Edit
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen} title="Edit Playlist">
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="New playlist name"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="p-2 rounded-md bg-gray-800 border border-gray-600"
          />
          <input
            type="text"
            placeholder="New playlist cover"
            value={newCover}
            onChange={(e) => setNewCover(e.target.value)}
            className="p-2 rounded-md bg-gray-800 border border-gray-600"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <AlertDialog.Cancel asChild>
            <button className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500">
              Cancel
            </button>
          </AlertDialog.Cancel>
          <button
            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500"
            onClick={updatePlaylist}
            disabled={!newTitle.trim() && !newCover.trim()}
          >
            Update
          </button>
        </div>
      </Dialog>
    </>
  );
}
