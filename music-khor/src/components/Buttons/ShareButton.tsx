import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Share1Icon } from "@radix-ui/react-icons";
import { APP_BASE } from "@/lib/config";
import Dialog from "@/components/ui/Dialog";

export default function ShareButton({ playlistId, isOpen, setIsOpen }) {
  const generatePlaylistLink = () => `${APP_BASE}/playlist/${playlistId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePlaylistLink());
  };

  const sharePlaylist = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(generatePlaylistLink())}`,
      "_blank"
    );
  };

  return (
    <>
      <button
        className="flex p-2 cursor-pointer hover:bg-zinc-700 w-full text-left hover:rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <Share1Icon className="w-6 h-6 mr-4" /> Share
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen} title="Share Playlist">
        <div className="flex justify-end space-x-3 mb-4">
          <input
            type="text"
            value={generatePlaylistLink()}
            readOnly
            className="w-full p-2 bg-zinc-800 rounded-md text-sm text-white"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:scale-105"
          >
            Copy
          </button>
        </div>
        <button
          onClick={sharePlaylist}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm w-full hover:scale-105"
        >
          Share on Telegram
        </button>
        <div className="mt-4 flex justify-end space-x-4">
          <AlertDialog.Cancel asChild>
            <button className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500">
              Close
            </button>
          </AlertDialog.Cancel>
        </div>
      </Dialog>
    </>
  );
}
