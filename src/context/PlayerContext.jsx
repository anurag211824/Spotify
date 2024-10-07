import { createContext, useState, useRef, useEffect } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef(null);
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  const playWithId = async (id) => {
    await setTrack(songsData[id]);
    audioRef.current.play();
    setPlayStatus(true);
  };

  const previous = async () => {
    if (track.id > 0) {
      await setTrack(songsData[track.id - 1]);
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const next = async () => {
    if (track.id < songsData.length - 1) {
      await setTrack(songsData[track.id + 1]);
      audioRef.current.play();
      setPlayStatus(true);
    }
  };
  const seekSong = async (e) => {
    const offsetX = e.nativeEvent.offsetX; // Correct access to offsetX
    const seekBarWidth = seekBg.current.offsetWidth; // Width of the seek bar
    const duration = audioRef.current.duration; // Total duration of the audio
    
    // Calculate the new time based on where the user clicked on the seek bar
    audioRef.current.currentTime = (offsetX / seekBarWidth) * duration;
  };
  
  useEffect(() => {
    const updateSeekBar = () => {
      if (audioRef.current && seekBar.current && audioRef.current.duration) {
        seekBar.current.style.width =
          Math.floor(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          ) + "%";

        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      }

      // Schedule the next update
      setTimeout(updateSeekBar, 1000);
    };

    // Start the first timeout
    const timeoutId = setTimeout(updateSeekBar, 1000);

    // Clean up the timeout if the component unmounts or track changes
    return () => clearTimeout(timeoutId);
  }, [track]);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
