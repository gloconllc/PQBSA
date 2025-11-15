// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { decode, decodeAudioData } from '../utils/audio';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

interface AudioPlayerProps {
  audioData: string | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef(0);
  const startedAtRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
  }, []);

  useEffect(() => {
    const decodeAndSetBuffer = async () => {
      if (audioData && audioContextRef.current) {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        if (sourceNodeRef.current) {
          // Fix: The stop() method requires an argument in some environments. Passing 0 stops playback immediately.
          sourceNodeRef.current.stop(0);
        }
        try {
          const decoded = decode(audioData);
          const buffer = await decodeAudioData(decoded, audioContextRef.current, 24000, 1);
          setAudioBuffer(buffer);
          setDuration(buffer.duration);
        } catch (error) {
          console.error('Failed to decode audio data', error);
          setAudioBuffer(null);
        }
      }
    };
    decodeAndSetBuffer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioData]);

  const updateProgress = useCallback(() => {
    if (isPlaying && audioContextRef.current && audioBuffer) {
      const elapsedTime = audioContextRef.current.currentTime - startedAtRef.current;
      const newCurrentTime = startTimeRef.current + elapsedTime;
      setCurrentTime(newCurrentTime);
      setProgress((newCurrentTime / audioBuffer.duration) * 100);

      if (newCurrentTime >= audioBuffer.duration) {
        setIsPlaying(false);
        setCurrentTime(audioBuffer.duration);
        setProgress(100);
      } else {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    }
  }, [isPlaying, audioBuffer]);

  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateProgress]);

  const play = useCallback(() => {
    if (!audioBuffer || !audioContextRef.current) return;
    
    if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    
    const offset = startTimeRef.current;
    source.start(0, offset);
    
    startedAtRef.current = audioContextRef.current.currentTime - offset;
    sourceNodeRef.current = source;
    
    source.onended = () => {
        if (progress >= 99) { // onended can fire on stop()
             setIsPlaying(false);
             startTimeRef.current = 0;
        }
    };

  }, [audioBuffer, progress]);

  const togglePlayPause = () => {
    if (!audioBuffer) return;

    if (isPlaying) {
      sourceNodeRef.current?.stop(0);
      startTimeRef.current = currentTime; // Save current position
      setIsPlaying(false);
    } else {
       if (progress >= 99) {
          startTimeRef.current = 0;
       }
      play();
      setIsPlaying(true);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioBuffer) return;
    
    const newPercentage = parseFloat(e.target.value);
    setProgress(newPercentage);
    
    const newTime = (audioBuffer.duration * newPercentage) / 100;
    startTimeRef.current = newTime;
    setCurrentTime(newTime);
    
    if (isPlaying) {
      sourceNodeRef.current?.stop(0);
      play();
    }
  };


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!audioBuffer) return null;

  return (
    <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-4">
      <button
        onClick={togglePlayPause}
        className="p-2 bg-cyan-600 rounded-full text-white hover:bg-cyan-500 transition-colors"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className="flex-grow flex items-center gap-3">
        <span className="text-sm text-slate-400 w-10 text-center">{formatTime(currentTime)}</span>
        <div className="relative w-full h-2 bg-slate-700 rounded-full group">
            <input 
                type="range" 
                min="0" 
                max="100" 
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="absolute w-full h-full appearance-none bg-transparent cursor-pointer"
            />
            <div 
                className="absolute h-full bg-cyan-500 rounded-full" 
                style={{ width: `${progress}%` }}
            ></div>
            <div 
                className="absolute h-4 w-4 bg-white rounded-full -mt-1 transform group-hover:scale-110 transition-transform" 
                style={{ left: `calc(${progress}% - 8px)` }}
            ></div>
        </div>
        <span className="text-sm text-slate-400 w-10 text-center">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default AudioPlayer;