<script lang="ts">
  import Audio from "./Audio.svelte";
  import type { SoundEffects } from "./soundEffects";
  import { soundEffectsStore } from "./soundEffects";

  let effects: SoundEffects;
  $: effects = $soundEffectsStore;
</script>

{#each effects as audio (audio.id)}
  <Audio filePath={audio.filePath} autoplay={true} volume={audio.volume} on:end="{() => soundEffectsStore.remove(audio.id)}"/>
{/each}