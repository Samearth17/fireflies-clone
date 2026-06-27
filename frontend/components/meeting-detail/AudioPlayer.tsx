"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { formatTimestamp } from "@/lib/utils";

interface AudioPlayerProps {
  duration: number;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

export function AudioPlayer({ duration, currentTime, onSeek }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      onSeek(Math.min(duration, currentTime + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [currentTime, duration, onSeek, playing]);

  useEffect(() => {
    if (currentTime >= duration) setPlaying(false);
  }, [currentTime, duration]);

  return (
    <section className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">Media player</p>
          <p className="text-xs text-muted">Recording placeholder</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onSeek(Math.max(0, currentTime - 15))} aria-label="Back 15 seconds">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button size="icon" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onSeek(Math.min(duration, currentTime + 15))} aria-label="Forward 15 seconds">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <input
        className="h-2 w-full accent-primary"
        type="range"
        min={0}
        max={duration || 1}
        value={Math.min(currentTime, duration)}
        onChange={(event) => onSeek(Number(event.target.value))}
        aria-label="Seek recording"
      />
      <div className="mt-2 flex justify-between text-xs font-medium text-muted">
        <span>{formatTimestamp(currentTime)}</span>
        <span>{formatTimestamp(duration)}</span>
      </div>
    </section>
  );
}
