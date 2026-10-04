import { describe, expect, it, vi } from 'vitest';
import { createLiveNotesStore, parseNotesChanged } from './live-notes.ts';

vi.mock('virtual:open-slide/slides', () => ({
  slideIds: [],
  slideThemes: {},
  slideCreatedAt: {},
  loadSlide: async () => ({ default: [] }),
}));

describe('parseNotesChanged', () => {
  it('accepts a well-formed payload', () => {
    expect(parseNotesChanged({ slideId: 'deck', index: 2, text: 'hi' })).toEqual({
      slideId: 'deck',
      index: 2,
      text: 'hi',
    });
  });

  it('rejects malformed payloads', () => {
    expect(parseNotesChanged(null)).toBeNull();
    expect(parseNotesChanged({ slideId: 'deck', index: -1, text: 'hi' })).toBeNull();
    expect(parseNotesChanged({ slideId: 'deck', index: 1.5, text: 'hi' })).toBeNull();
    expect(parseNotesChanged({ slideId: 'deck', index: 0 })).toBeNull();
    expect(parseNotesChanged({ index: 0, text: 'hi' })).toBeNull();
  });
});

describe('createLiveNotesStore', () => {
  it('falls back to the module note until an edit arrives', () => {
    const store = createLiveNotesStore();
    expect(store.resolve('deck', 0, 'from module')).toBe('from module');
    store.apply({ slideId: 'deck', index: 0, text: 'edited' });
    expect(store.resolve('deck', 0, 'from module')).toBe('edited');
    expect(store.resolve('deck', 1, 'other page')).toBe('other page');
    expect(store.resolve('other', 0, 'other deck')).toBe('other deck');
  });

  it('treats a cleared note as no note', () => {
    const store = createLiveNotesStore();
    store.apply({ slideId: 'deck', index: 0, text: '' });
    expect(store.resolve('deck', 0, 'from module')).toBeUndefined();
  });

  it('drops overrides once the deck module reloads', () => {
    const store = createLiveNotesStore();
    store.apply({ slideId: 'deck', index: 0, text: 'edited' });
    store.apply({ slideId: 'other', index: 0, text: 'kept' });
    store.clear(['deck']);
    expect(store.resolve('deck', 0, 'fresh module')).toBe('fresh module');
    expect(store.resolve('other', 0, undefined)).toBe('kept');
  });

  it('notifies subscribers only on real changes', () => {
    const store = createLiveNotesStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.clear(['deck']);
    expect(listener).not.toHaveBeenCalled();
    store.apply({ slideId: 'deck', index: 0, text: 'edited' });
    store.clear(['deck']);
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    store.apply({ slideId: 'deck', index: 0, text: 'again' });
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
