import React, { useEffect, useState, useRef } from "react";
import { Slider } from "@/components/Playerbar/Slider";
import ReactDOM from "react-dom";
import { usePlayerStore } from "@/store/playerStore";
import { formatDuration as formatTime } from "@/lib/utils";
const useIsMobile = (breakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

export default function PlayerSoundControl({ audio }) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastStableTime = useRef<number>(0);
  const isMobile = useIsMobile(1024);
  const currentMusic = usePlayerStore((state) => state.currentMusic);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audio.current && currentMusic?.song?.id && !isDragging) {
        localStorage.setItem(
          "playerCurrentTime",
          audio.current.currentTime.toString()
        );
        localStorage.setItem("playerCurrentId", currentMusic.song.id.toString());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentMusic, isDragging, audio]);

  useEffect(() => {
    const savedTime = localStorage.getItem("playerCurrentTime");
    const audioElement = audio.current;

    if (audioElement && savedTime) {
      audioElement.currentTime = parseFloat(savedTime);
      setCurrentTime(parseFloat(savedTime));
    }
  }, [audio]);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    time: string;
    x: number;
  }>({
    visible: false,
    time: "0:00",
    x: 0,
  });

  useEffect(() => {
    const audioElement = audio.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audioElement.currentTime);
      }
    };

    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audio, isDragging]);

  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handleSliderChange = (value: number[]) => {
    const duration = audio.current?.duration;
    if (!duration) {
      setTooltip((prev) => ({ ...prev, visible: false }));
      return;
    }
    const [newCurrentTime] = value;
    setIsDragging(true);
    setCurrentTime(newCurrentTime);
    lastStableTime.current = newCurrentTime;

    const fraction = newCurrentTime / duration;
    const sliderWidth = sliderRef.current?.offsetWidth ?? 1005;
    setTooltip({
      visible: true,
      time: formatTime(newCurrentTime),
      x: fraction * sliderWidth,
    });
  };

  const handleSliderCommit = (value: number[]) => {
    const [newCurrentTime] = value;
    if (audio.current) {
      audio.current.currentTime = newCurrentTime;
    }
    setIsDragging(false);
  };

  const sliderComponent = (
    <Slider
      value={[isDragging ? lastStableTime.current : currentTime]}
      max={audio.current?.duration ?? 0}
      min={0}
      className="w-full lg:w-[400px]"
      onValueChange={(value) => handleSliderChange(value)}
      onValueCommit={handleSliderCommit}
    />
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const duration = audio.current?.duration;

    if (!duration) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const fraction = x / rect.width;
    const newTime = fraction * duration;
    setTooltip({ visible: true, time: formatTime(newTime), x });
  };

  if (isMobile) {
    const container = document.getElementById("mobile-slider-container");
    if (container) {
      return ReactDOM.createPortal(
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() =>
            setTooltip((prev) => ({ ...prev, visible: true }))
          }
          onMouseLeave={() =>
            setTooltip((prev) => ({ ...prev, visible: false }))
          }
        >
          <div ref={sliderRef}>{sliderComponent}</div>
          {tooltip.visible && (
            <div
              className="absolute -top-8 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded p-1"
              style={{ left: tooltip.x }}
            >
              {tooltip.time}
            </div>
          )}
        </div>,
        container
      );
    }
  }

  return (
    <div className="flex gap-x-3 text-xs pt-2 items-center hidden lg:flex">
      <span className="opacity-50 w-12 text-right">
        {formatTime(currentTime)}
      </span>
      {sliderComponent}
      <span className="opacity-50 w-12">
        {audio.current?.duration ? formatTime(audio.current.duration) : "0:00"}
      </span>
    </div>
  );
}
