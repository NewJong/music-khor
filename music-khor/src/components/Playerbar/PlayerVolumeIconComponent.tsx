import { usePlayerStore } from "@/store/playerStore";
import {
  SpeakerLoudIcon,
  SpeakerModerateIcon,
  SpeakerOffIcon,
  SpeakerQuietIcon,
} from "@radix-ui/react-icons";

const isVolumeSilenced = (loud: number) => loud < 0.01;
const isVolumeLow = (loud: number) => loud >= 0.01 && loud < 0.4;
const isVolumeMedium = (loud: number) => loud >= 0.4 && loud < 1;
const isVolumeFull = (loud: number) => loud >= 1;

const getVolumeIconByLouder = (loud: number) => {
  return (
    <>
      {isVolumeSilenced(loud) && (
        <SpeakerOffIcon className="text-red-500 h-5 w-5 hover:scale-110" />
      )}
      {isVolumeLow(loud) && (
        <SpeakerQuietIcon className="h-5 w-5 hover:scale-110" />
      )}
      {isVolumeMedium(loud) && (
        <SpeakerModerateIcon className="h-5 w-5 hover:scale-110" />
      )}
      {isVolumeFull(loud) && (
        <SpeakerLoudIcon className="h-5 w-5 hover:scale-110" />
      )}
    </>
  );
};

export default function PlayerVolumeIconComponent() {
  const volume = usePlayerStore((state) => state.volume);
  return getVolumeIconByLouder(volume);
}
