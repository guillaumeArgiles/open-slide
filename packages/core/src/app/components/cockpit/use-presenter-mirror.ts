import { useEffect, useRef, useState } from 'react';
import { type PresenterState, usePresenterChannel } from '../present/use-presenter-channel';

export function usePresenterMirror(slideId: string) {
  const [state, setState] = useState<PresenterState | null>(null);
  const [linked, setLinked] = useState(false);
  const requestedRef = useRef(false);

  const channel = usePresenterChannel(slideId, (msg) => {
    if (msg.type === 'state') {
      setState(msg.state);
      setLinked(true);
    }
  });

  const prevSlideIdRef = useRef(slideId);
  if (prevSlideIdRef.current !== slideId) {
    prevSlideIdRef.current = slideId;
    setState(null);
    setLinked(false);
    requestedRef.current = false;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: slideId re-fires the handshake on a deck switch even when the channel memo keeps its identity
  useEffect(() => {
    if (!channel.available || requestedRef.current) return;
    requestedRef.current = true;
    channel.send({ type: 'request-state' });
  }, [channel, slideId]);

  return { state, linked, send: channel.send };
}

export function openCockpitTab(slideId: string) {
  if (typeof window === 'undefined') return;
  const url = `${import.meta.env.BASE_URL}s/${encodeURIComponent(slideId)}/cockpit`;
  window.open(url, `open-slide-cockpit-${slideId}`);
}
