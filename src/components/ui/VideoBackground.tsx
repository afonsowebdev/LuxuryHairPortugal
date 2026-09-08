"use client";

import { useEffect, useRef, useState } from "react";

interface Clip {
  src: string;
  poster: string;
}

// Two permanently-mounted <video> layers crossfade into each other instead
// of hard-cutting: the hidden layer's src is swapped and started a beat
// before it fades in, so the switch reads as one continuous dissolve.
export function VideoBackground({ clips, className = "" }: { clips: Clip[]; className?: string }) {
  const videoRef0 = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRefs = [videoRef0, videoRef1];
  const [front, setFront] = useState<0 | 1>(0);
  const nextClip = useRef(1);

  useEffect(() => {
    const v = videoRef0.current;
    if (!v) return;
    v.src = clips[0].src;
    v.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleEnded(layer: 0 | 1) {
    if (layer !== front) return; // the hidden layer finishing doesn't drive anything
    const back = layer === 0 ? 1 : 0;
    const backVideo = videoRefs[back].current;
    if (backVideo) {
      backVideo.src = clips[nextClip.current % clips.length].src;
      backVideo.currentTime = 0;
      backVideo.play().catch(() => {});
    }
    nextClip.current = (nextClip.current + 1) % clips.length;
    setFront(back);
  }

  return (
    <>
      {([0, 1] as const).map((layer) => (
        <video
          key={layer}
          ref={videoRefs[layer]}
          muted
          playsInline
          poster={clips[layer].poster}
          onEnded={() => handleEnded(layer)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
            front === layer ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      ))}
    </>
  );
}
