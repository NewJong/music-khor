import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import useCurrentMusic from "@/hooks/useCurrentMusic";
import PlayerControlButtonBar from "@/components/Playerbar/PlayerControlButtonBar";
import PlayerCurrentSong from "@/components/Playerbar/PlayerCurrentSong";
import PlayerSoundControl from "@/components/Playerbar/PlayerSoundControl";
import PlayerVolumeControl from "@/components/Playerbar/PlayerVolumeControl";
import SongLikeButton from "../Buttons/SongLikeButton";
import { LoopIcon } from "@radix-ui/react-icons";

export default function Player() {
  const { currentMusic, isPlaying, volume, setCurrentMusic, setIsPlaying } =
    usePlayerStore((state) => state);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { getNextSong } = useCurrentMusic(currentMusic);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    if (!currentMusic.song) return;
    if (isPlaying) {
      play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const { song } = currentMusic;
  
    if (song && audioRef.current) {
      audioRef.current.src = song.file_path;
  
      const savedId = localStorage.getItem("playerCurrentId");
      const savedTime = localStorage.getItem("playerCurrentTime");
  
      if (savedId === song.id.toString() && savedTime) {
        audioRef.current.currentTime = parseFloat(savedTime);
      }
  
      if (isPlaying) {
        play();
      }
    }
  }, [currentMusic]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const onNextSong = () => {
    if (isRepeat) {
      play();
    } else {
      if (currentMusic.songs.length === 0) return;
      let nextSong = getNextSong();
      if (!nextSong) {
        nextSong = currentMusic.songs[0];
      }
      if (nextSong) {
        setCurrentMusic({ ...currentMusic, song: nextSong });
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flex items-center justify-between w-full gap-4 mb-2">
      <div className="flex-1 basis-1/4">
        <PlayerCurrentSong {...currentMusic.song} />
      </div>

      <div className="flex flex-col items-center flex-1 gap-2 mt-2">
        <PlayerControlButtonBar />
        <PlayerSoundControl audio={audioRef} />
        <audio ref={audioRef} onEnded={onNextSong} />
      </div>

      <div className="flex-1 basis-1/4 flex items-center justify-end hidden sm:flex gap-4">
        {currentMusic.song && (
          <>
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`rounded-full transition ${
                isRepeat ? "text-green-500 hover:scale-125" : "hover:scale-125"
              }`}
              title="Repeat song"
            >
              <LoopIcon className="h-5 w-5" />
            </button>
            <SongLikeButton songId={currentMusic.song.id} />
          </>
        )}
        <PlayerVolumeControl />
      </div>
    </div>
  );
}
