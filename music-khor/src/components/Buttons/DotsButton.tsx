import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ShareButton from "./ShareButton";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import ShuffleButton from "./ShuffleButton";
import { useState } from "react";

export default function DotsButton({ playlistId, songs, type, title }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <DotsHorizontalIcon
          className="h-8 w-8 text-white transition duration-300 ease-in-out 
        hover:translate-y-[-2px] hover:scale-110 hover:rotate-180"
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="bg-zinc-900 text-white rounded-lg shadow-lg p-2 w-40">
        <DropdownMenu.Item asChild>
          <ShuffleButton playlistId={playlistId} songs={songs} />
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <ShareButton
            playlistId={playlistId}
            isOpen={isShareOpen}
            setIsOpen={setIsShareOpen}
          />
        </DropdownMenu.Item>
        {type === "liked" && title !== "Music you liked" && (
          <>
            <DropdownMenu.Item asChild>
              <EditButton
                playlistId={playlistId}
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
              />
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <DeleteButton
                playlistId={playlistId}
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
              />
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
