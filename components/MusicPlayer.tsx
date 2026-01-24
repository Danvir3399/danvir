
import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  lang?: 'en' | 'ru';
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  currentTrack, 
  isPlaying, 
  onTogglePlay,
  onNext,
  onPrev,
  lang = 'en'
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Effect to handle play/pause and track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      setIsLoading(true);
      setHasError(false);
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsLoading(false);
            setHasError(false);
          })
          .catch(error => {
            // Log only string property to avoid circular reference error
            console.error("Playback failed:", error?.name || "Unknown error");
            if (error?.name !== 'AbortError') {
              setHasError(true);
            }
            setIsLoading(false);
          });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack?.audioUrl]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      const current = audio.currentTime;
      const duration = audio.duration;
      if (!isNaN(duration) && duration > 0) {
        setProgress((current / duration) * 100);
      }
      
      const mins = Math.floor(current / 60);
      const secs = Math.floor(current % 60).toString().padStart(2, '0');
      setCurrentTime(`${mins}:${secs}`);
    }
  };

  const handleLoadedMetadata = () => {
    setHasError(false);
    setIsLoading(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const newTime = (parseFloat(e.target.value) / 100) * audio.duration;
      audio.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!currentTrack) return null;

  const t = {
    en: { loading: 'Loading...', error: 'Error' },
    ru: { loading: 'Загрузка...', error: 'Ошибка' }
  }[lang];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-white/10 p-4 md:p-6 flex flex-col gap-3 backdrop-blur-xl">
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl}
        crossOrigin="anonymous"
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onCanPlay={() => setIsLoading(false)}
        onError={(e) => {
            // Fixed: log type instead of full event to prevent circular structure error
            console.error("Audio playback error detected:", e.type);
            setHasError(true);
            setIsLoading(false);
        }}
      />
      
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-4">
        {/* Track Info & Visualizer */}
        <div className="flex items-center gap-4 w-1/3 min-w-0">
          <div className="hidden sm:flex w-12 h-12 bg-zinc-900 border border-white/5 items-center justify-center relative overflow-hidden flex-shrink-0">
             {isPlaying && !isLoading && !hasError ? (
               <div className="flex items-end gap-[2px] h-5">
                 <div className="w-1 bg-white animate-[bounce_1s_infinite_0.1s]"></div>
                 <div className="w-1 bg-white animate-[bounce_0.8s_infinite_0.3s]"></div>
                 <div className="w-1 bg-white animate-[bounce_1.2s_infinite_0.5s]"></div>
               </div>
             ) : (
               <i className="fa-solid fa-music text-zinc-800"></i>
             )}
          </div>
          <div className="truncate">
            <h4 className="text-sm font-bold truncate text-white uppercase tracking-[0.1em] flex items-center gap-2">
                {currentTrack.title}
                {isLoading && <span className="text-[8px] text-zinc-500 animate-pulse">{t.loading}</span>}
                {hasError && <span className="text-[8px] text-red-500">{t.error}</span>}
            </h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest opacity-60">DANVIR // {currentTrack.duration}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1 w-1/3">
          <div className="flex items-center gap-6 md:gap-10">
            <button onClick={onPrev} className="text-zinc-500 hover:text-white transition-all transform active:scale-90">
              <i className="fa-solid fa-step-backward text-xs"></i>
            </button>
            
            <button 
              onClick={onTogglePlay} 
              className={`group w-14 h-14 rounded-full border border-white/10 flex items-center justify-center transition-all ${isLoading ? 'opacity-50' : 'hover:bg-white hover:border-white text-white hover:text-black hover:scale-105 active:scale-95'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                  <i className="fa-solid fa-circle-notch fa-spin text-sm text-white"></i>
              ) : (
                  <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} ${!isPlaying ? 'ml-1' : ''} text-xl transition-colors`}></i>
              )}
            </button>

            <button onClick={onNext} className="text-zinc-500 hover:text-white transition-all transform active:scale-90">
              <i className="fa-solid fa-step-forward text-xs"></i>
            </button>
          </div>
        </div>

        {/* Volume & Time */}
        <div className="w-1/3 flex justify-end items-center gap-6">
          <button onClick={toggleMute} className="text-zinc-500 hover:text-white transition-colors group">
            <i className={`fa-solid ${isMuted ? 'fa-volume-xmark text-red-700' : 'fa-volume-high'} text-sm`}></i>
          </button>
          <div className="hidden md:block text-[10px] text-zinc-500 font-mono tracking-widest opacity-50">
            {currentTime} / {currentTrack.duration}
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-7xl mx-auto group mt-1">
        <div className="relative h-1 w-full bg-zinc-900/50 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-white/40 group-hover:bg-white transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="0.1"
            value={progress || 0}
            onChange={handleSeek}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { height: 4px; }
          50% { height: 18px; }
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;
