import React, { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { Slider } from "@/components/Playerbar/Slider";
import PlayerVolumeIconComponent from "@/components/Playerbar/PlayerVolumeIconComponent";

export default function PlayerVolumeControl() {
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const previousVolumeRef = useRef(volume);

  const isVolumeSilenced = volume < 0.1;

  const handleClickVolume = () => {
    if (isVolumeSilenced) {
      setVolume(previousVolumeRef.current);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
    }
  };
  useEffect(() => {
    setVolume(0); 
    setTimeout(() => {
      setVolume(previousVolumeRef.current);
    }, 200); 
  }, [setVolume]);
  
  return (
    <div className="flex justify-center gap-x-2 text-white">
      <button
        className="opacity-70 hover:opacity-100 transition"
        onClick={handleClickVolume}
        title="Turn off sound"
      >
        <PlayerVolumeIconComponent />
      </button>

      <Slider
        defaultValue={[100]}
        max={100}
        min={0}
        value={[volume * 100]}
        className="w-[95px]"
        onValueChange={(value) => {
          const [newVolume] = value;
          const volumeValue = newVolume / 100;
          setVolume(volumeValue);
        }}
      />
    </div>
  );
}
