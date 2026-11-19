import * as AlertDialog from "@radix-ui/react-alert-dialog";
import type { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  widthClassName?: string;
}

export default function Dialog({
  open,
  onOpenChange,
  title,
  children,
  widthClassName = "w-80 xs:w-96",
}: DialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-30 z-50" />
        <AlertDialog.Content
          className={`fixed top-1/2 left-1/2 ${widthClassName} p-6 bg-zinc-900 text-white rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-50`}
        >
          <AlertDialog.Title className="text-lg font-semibold mb-4">
            {title}
          </AlertDialog.Title>
          {children}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
