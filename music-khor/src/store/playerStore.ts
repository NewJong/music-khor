import { create } from "zustand";

export interface Song {
  id: number;
  title: string;
  artists: string;
  image: string;
  file_path: string;
  duration: number;
}

export interface CurrentMusic {
  playlistId: number | null;
  song: Song | null;
  songs: Song[];
}

export interface PlayerStore {
  isPlaying: boolean;
  currentMusic: CurrentMusic;
  volume: number;
  setVolume: (volume: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentMusic: (currentMusic: CurrentMusic) => void;
}

const savedState =
  typeof window !== "undefined" ? localStorage.getItem("playerState") : null;
const parsed = savedState ? JSON.parse(savedState) : {};
const initialState = {
  currentMusic: parsed.currentMusic ?? { playlistId: null, song: null, songs: [] },
  volume: parsed.volume ?? 0.1,
  isPlaying: false,
};

export const usePlayerStore = create<PlayerStore>((set) => ({
  ...initialState,
  setVolume: (volume) => set({ volume }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentMusic: (currentMusic) => set({ currentMusic }),
}));

usePlayerStore.subscribe((state) => {
  const stateToSave = {
    currentMusic: state.currentMusic,
    volume: state.volume,
  };
  localStorage.setItem("playerState", JSON.stringify(stateToSave));
});
