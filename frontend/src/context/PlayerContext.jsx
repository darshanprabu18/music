import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "../api/client.js";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const playSong = useCallback(async (song, songs = []) => {
    setCurrent(song);
    if (songs.length) setQueue(songs);
    audioRef.current.src = song.audioUrl;
    await audioRef.current.play();
    setIsPlaying(true);
    api.post(`/songs/${song._id}/play`).catch(() => {});
  }, []);

  const togglePlay = useCallback(async () => {
    if (!current) return;
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [current]);

  const playNext = useCallback(() => {
    if (!current || !queue.length) return;
    const nextIndex = shuffle
      ? Math.floor(Math.random() * queue.length)
      : (queue.findIndex((item) => item._id === current._id) + 1) % queue.length;
    playSong(queue[nextIndex], queue);
  }, [current, playSong, queue, shuffle]);

  const playPrevious = useCallback(() => {
    if (!current || !queue.length) return;
    const index = queue.findIndex((item) => item._id === current._id);
    const previousIndex = index <= 0 ? queue.length - 1 : index - 1;
    playSong(queue[previousIndex], queue);
  }, [current, playSong, queue]);

  const seek = (value) => {
    audioRef.current.currentTime = value;
    setProgress(value);
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setProgress(audio.currentTime || 0);
    const onMeta = () => setDuration(audio.duration || current?.duration || 0);
    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [current, playNext, repeat]);

  const value = useMemo(
    () => ({
      current,
      queue,
      isPlaying,
      progress,
      duration,
      volume,
      repeat,
      shuffle,
      setVolume,
      setRepeat,
      setShuffle,
      playSong,
      togglePlay,
      playNext,
      playPrevious,
      seek
    }),
    [current, queue, isPlaying, progress, duration, volume, repeat, shuffle, playSong, togglePlay, playNext, playPrevious]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
