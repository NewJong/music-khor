import Dialog from "@/components/ui/Dialog";

export default function AuthAlertDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
      title="Sign in to continue"
      widthClassName="w-96"
    >
      <p className="mb-4 text-gray-300">
        To add and remove songs from playlists, you need to sign in.
      </p>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
        >
          Ok
        </button>
      </div>
    </Dialog>
  );
}
