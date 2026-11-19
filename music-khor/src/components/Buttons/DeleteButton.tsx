import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { TrashIcon } from "@radix-ui/react-icons";
import { fetchData } from "@/lib/fetchData";
import { getCurrentUserId } from "@/lib/auth";
import Dialog from "@/components/ui/Dialog";

export default function DeleteButton({ playlistId, isOpen, setIsOpen }) {
  const deletePlaylist = async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    await fetchData("delete-user-playlist", "DELETE", {
      user_id: userId,
      playlist_id: playlistId,
    });

    setIsOpen(false);
    window.dispatchEvent(new Event("playlistCreated"));
  };

  return (
    <>
      <button
        className="flex p-2 cursor-pointer hover:bg-red-700 text-red-400 w-full text-left hover:rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <TrashIcon className="w-6 h-6 mr-4" /> Delete
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen} title="Confirm Deletion">
        <p className="text-sm text-gray-400">
          Are you sure you want to delete this playlist? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end space-x-4">
          <AlertDialog.Cancel asChild>
            <button className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500">
              Cancel
            </button>
          </AlertDialog.Cancel>
          <button
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500"
            onClick={deletePlaylist}
          >
            Delete
          </button>
        </div>
      </Dialog>
    </>
  );
}
