<script lang="ts">
  import { onMount } from "svelte";
import { playSound } from "../soundEffects";
  import type { MonologueNode } from "../statemachine/controller";
  import { gameStateStore } from "../statemachine/controller";
  import Textbox from "./Textbox.svelte";
  
  export let node: MonologueNode;

  onMount(() => {
    if (node.onEnter) node.onEnter($gameStateStore);
    if (node.sounds) {
      node.sounds.forEach(sound => {
        playSound(sound.filePath, sound.volume, sound.delay)
      })
    }
  })

  let text: string[];
  $: text = node.text($gameStateStore);

  let stage = 0;

  function next() {
    const newStage = stage + 1;
    if (newStage < text.length) stage = newStage;
    else node.next($gameStateStore);
  }
</script>

{#key stage}
  <Textbox text={text[stage]} on:next={next}/>
{/key}
