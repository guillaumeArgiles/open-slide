import { useEffect, useSyncExternalStore } from 'react';
import { changedSlideIds } from './slides';

export type NotesChangedEvent = { slideId: string; index: number; text: string };

export function parseNotesChanged(data: unknown): NotesChangedEvent | null {
  if (!data || typeof data !== 'object') return null;
  const { slideId, index, text } = data as Record<string, unknown>;
  if (typeof slideId !== 'string' || typeof text !== 'string') return null;
  if (typeof index !== 'number' || !Number.isInteger(index) || index < 0) return null;
  return { slideId, index, text };
}

// Note writes suppress HMR so the editing textarea keeps focus, which leaves
// every other window on the stale module. Overrides bridge that gap until the
// module genuinely reloads, at which point the module is authoritative again.
export function createLiveNotesStore() {
  const overrides = new Map<string, Map<number, string>>();
  const listeners = new Set<() => void>();
  let version = 0;
  const emit = () => {
    version++;
    for (const l of listeners) l();
  };

  return {
    apply({ slideId, index, text }: NotesChangedEvent) {
      let deck = overrides.get(slideId);
      if (!deck) {
        deck = new Map();
        overrides.set(slideId, deck);
      }
      deck.set(index, text);
      emit();
    },
    clear(slideIds: string[]) {
      let changed = false;
      for (const id of slideIds) changed = overrides.delete(id) || changed;
      if (changed) emit();
    },
    resolve(slideId: string, index: number, fallback: string | undefined): string | undefined {
      const text = overrides.get(slideId)?.get(index);
      if (text === undefined) return fallback;
      return text === '' ? undefined : text;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getVersion: () => version,
  };
}

const store = createLiveNotesStore();

export function useLiveNote(
  slideId: string,
  index: number,
  fallback: string | undefined,
): string | undefined {
  useSyncExternalStore(store.subscribe, store.getVersion, store.getVersion);

  useEffect(() => {
    const hot = import.meta.hot;
    if (!hot) return;
    const onNotes = (data: unknown) => {
      const event = parseNotesChanged(data);
      if (event) store.apply(event);
    };
    const onSlides = (data: unknown) => store.clear(changedSlideIds(data));
    hot.on('open-slide:notes-changed', onNotes);
    hot.on('open-slide:slide-changed', onSlides);
    return () => {
      hot.off('open-slide:notes-changed', onNotes);
      hot.off('open-slide:slide-changed', onSlides);
    };
  }, []);

  return store.resolve(slideId, index, fallback);
}
