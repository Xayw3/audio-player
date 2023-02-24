import PlayIcon, { FullVolumeIcon, MuteIcon, NextIcon, PauseIcon, PrevIcon, SpeedIcon, VolumeIcon } from "@/icons/icons";
import Audio from "@/models/Audio";
import axios from "axios";
import { time } from "console";
import { useState, useRef, useEffect } from "react";
import styles from './player.module.scss';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [data, setData] = useState<Audio[]>([]);
  const [currentPlay, setCurrentPlay] = useState('');
  const [audioIndex, setAudioIndex] = useState(0);
  const [volume, setVolume] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isLeave, setIsLeave] = useState(false);
  const [isNextAudio, setIsNextAudio] = useState(false);

  const audioPlayer = useRef<HTMLAudioElement>(null);

  const cover = [
    'image-1.png', 
    'image-2.png', 
    'image-3.png', 
    'image-4.png', 
    'image-5.png', 
    'image-6.png', 
    'image-7.png', 
    'image-8.png', 
    'image-9.png'
  ];

  const getData = async () => {
    try {
      const audio: any = await axios.get('/api/files');
      setData(audio.data);
    } catch (error) {
      console.log(error);
    };
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
    const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);

    return `${minutes}:${seconds}`
  }

  const handleTimeChange = (e: any) => {
    const audio = audioPlayer.current;
    if (audio) {
      audio.currentTime = e.target.value
    }
  }

  const getTime = () => {
    if (isPlaying) {
      setInterval(() => {
        const duration = audioPlayer.current ? audioPlayer.current.duration : 0;
        const time = audioPlayer.current ? audioPlayer.current.currentTime : 0;

        setTimeRemaining(duration);
        setCurrentTime(time); 
        console.log(duration)
      }, 100);

      audioPlayer?.current?.addEventListener('ended', handleNext);
    };
  };

  useEffect(() => {
    getData();
    getTime();

    if (audioPlayer.current !== null) {
      audioPlayer.current.playbackRate = playbackRate;
    }

    if(audioPlayer.current !== null) {
      audioPlayer.current.volume = volume / 100;
    }

  }, [volume, isPlaying, playbackRate, currentPlay, audioIndex]);

  const togglePlay = () => {
    if (currentPlay === '') {
      setCurrentPlay(data[audioIndex]?.name);
    }

    if (audioPlayer.current !== null) {
      if (!isPlaying) {
        audioPlayer.current.play();
      } else {
        audioPlayer.current.pause();
      };
      setIsPlaying(prev => !prev);
    };
  };

  const handleNext = () => {
    if (isActive) {
      setIsLeave(true);
      setIsActive(false);

      setTimeout(() => {
        setIsActive(true);
        setIsLeave(false);

        if (data.length - 1 === audioIndex) {
          setCurrentPlay(data[0]?.name);
          setAudioIndex(0);
        } else {
          setCurrentPlay(data[audioIndex + 1]?.name);
          setAudioIndex(audioIndex + 1);
        };
      },300);
    }
  };

  const handlePrev = () => {
    if (isActive) {
      setIsLeave(true);
      setIsActive(false);

      setTimeout(() => {
        setIsActive(true);
        setIsLeave(false);

        if (audioIndex === 0) {
          setCurrentPlay(data[data.length - 1]?.name);
          setAudioIndex(data.length - 1);
        } else {
          setCurrentPlay(data[audioIndex - 1]?.name);
          setAudioIndex(audioIndex - 1);
        };
      }, 300)
    }
  };

  const handlePlaybackRate = () => {
    if (playbackRate === 1) {
      setPlaybackRate(2)
    } else { 
      setPlaybackRate(1)
    }
  }

  return (
   <div className={styles.player}>
      <audio src={`./audio/${currentPlay}`} muted={muted} autoPlay={isPlaying} ref={audioPlayer}></audio>
      <div className={styles.player_top}>   
          <div className={styles.player_cover}>
            <div className={`${styles.player_cover__item} ${isActive ? styles.active : ''} ${isLeave ? styles.leave : ''}`} style={{ backgroundImage: `url(./cover/${cover[audioIndex]})` }} />
          </div>
        <div className={styles.btns}>
          <button className={`${styles.btn} ${playbackRate === 2 ? styles.active : ''}`} onClick={handlePlaybackRate}><SpeedIcon /></button>
          <button className={styles.btn} onClick={handlePrev}><PrevIcon /></button>
          <button className={styles.btn} onClick={handleNext}><NextIcon /></button>
          {
            isPlaying 
            ? <button className={`${styles.btn} ${styles.btn_xl}`} onClick={togglePlay}><PauseIcon /></button>
            : <button className={`${styles.btn} ${styles.btn_xl}`} onClick={togglePlay}><PlayIcon /></button>
          }
        </div>
        <div className={styles.progress__bar}>
          <div className={styles.progress__current} style={{ width: '15%' }}></div>
        </div>
      </div>
      <div className={styles.player_bottom}>
        <div className={styles.audio_wrapper}>
          <div className={styles.audio_info}>
            <p className={styles.audio_name}>{data[audioIndex]?.name.split('_')[0]}</p>
            <p className={styles.audio_track}>{data[audioIndex]?.name.split('_')[1].split('.')[0]}</p>
          </div>
          <p className={styles.audio_duration}>{timeRemaining === 0 ? data[0]?.duration : formatTime(timeRemaining)}</p>
        </div>
        <div className={styles.progress_wrapper}>
          <input 
            type="range"
            max={timeRemaining} 
            style={{ backgroundSize: `${(currentTime * 100 / timeRemaining).toFixed(0)}% 100%`}}
            value={currentTime}
            onChange={handleTimeChange}>
          </input>
        </div>
        <div className={styles.sound_wrapper}>
          <p className={styles.audio_duration}>{formatTime(currentTime)}</p>
          <div className={styles.volume_wrapper}>
            <button className={styles.btn} onClick={() => setMuted(!muted)}>
              {
                (muted || volume === 0) ? <MuteIcon /> : (volume > 79) ? <FullVolumeIcon /> : <VolumeIcon /> 
              }
            </button>
            <input 
              type="range" 
              min={0} 
              max={100}  
              style={{width: '40%', backgroundSize: `${volume}% 100%`}}
              value={volume}
              onChange={(e) => setVolume(e.target.valueAsNumber)}>
            </input>
          </div>
        </div>
      </div>
   </div>
  );
};

export default Player;