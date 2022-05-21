<script lang="ts">
  import type { IntroNode } from "../statemachine/controller";
  import { gameStateStore } from "../statemachine/controller";
  import { onMount } from "svelte";
  import { playSound } from "../soundEffects";
  import { scale, fade } from "svelte/transition";
  import { cubicIn } from "svelte/easing";

  export let node: IntroNode;

  onMount(() => {
    if (node.onEnter) node.onEnter($gameStateStore);
    if (node.sounds) {
      node.sounds.forEach(sound => {
        playSound(sound.filePath, sound.volume, sound.delay)
      })
    }
    playSound("effects/intro", 1, 0.5);
  })

  let show: boolean = true;
</script>

<style>
    .bgContainer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    width: 100vw;
    z-index: -1;
  }
  
  .bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>

<div class="bgContainer">
  <!-- svelte-ignore a11y-missing-attribute -->
  {#if show}
    <img 
      class="bg"
      src={`/notimetostalk/assets/characters/${node.character}/intro.jpg`} 
      in:scale={{duration: 1000, easing:cubicIn}} 
      out:fade={{duration: 500}} 
      on:introend="{() => setTimeout(() => {show = false;}, 3000)}"
      on:outroend="{() => node.next($gameStateStore)}"
    />
  {/if}
</div>
