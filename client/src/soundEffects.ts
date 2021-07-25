import { derived, writable } from "svelte/store";

export type SoundEffects = Array<{
  id: number;
  filePath: string;
  volume: number;
}>

const soundEffectsInternal = writable<{
  nextId: number,
  effects: SoundEffects
}>({
  nextId: 0,
  effects: []
});

export function playSound(filePath: string, volume: number = 1, delay: number = 0) {
  setTimeout(() => {
    soundEffectsInternal.update(state => {
      state.effects.push({
        id: state.nextId,
        filePath,
        volume
      });
      state.nextId++;
      return state;
    })
  }, delay * 1000)
}

function removeSoundEffect(idx: number) {
  soundEffectsInternal.update(state => ({
    nextId: state.nextId,
    effects: state.effects.filter(effect => effect.id !== idx)
  }))
}

export const soundEffectsStore = {
  subscribe: derived(soundEffectsInternal, state => state.effects).subscribe,
  remove: removeSoundEffect
}