<script lang="ts">
import { onMount } from "svelte";

  import { fade } from "svelte/transition";
import { playSound } from "../soundEffects";
  import type { OptionNode, Option } from "../statemachine/controller";
  import { gameStateStore } from "../statemachine/controller";

  export let node: OptionNode;

  onMount(() => {
    if (node.onEnter) node.onEnter($gameStateStore);
    if (node.sounds) {
      node.sounds.forEach(sound => {
        playSound(sound.filePath, sound.volume, sound.delay)
      })
    }
  })

  let prompt: string;
  $: prompt = node.prompt;

  let options: Option[];
  $: options = node.options;

  let filteredOptions: Option[];
  $: filteredOptions = options.filter(option => option.visible === undefined || option.visible($gameStateStore));

  function selectIdx(idx: number) {
    filteredOptions[idx].next($gameStateStore);
  }
</script>

<style>
  .textbox {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid black;
    position: fixed;
    top: 70vh;
    border-radius: 12px;
    bottom: 5vh;
    left: 25vw;
    right: 25vw;
    padding: 10px;

    background-color: white;
  }

  .options {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-y: auto;
  }

  .option {
    border: 1px solid black;
    margin: 4px;
    cursor: pointer;
    padding: 2px;
    border-radius: 6px;
    background: white;
  }

  .option:hover:enabled {
    background-color: lightblue;
  }

  .option:disabled {
    border: 1px solid black;
    margin: 4px;
    cursor: default;
    padding: 2px;
    border-radius: 6px;
    background: lightgray;
  }
  
  .text {
    font-style: italic;
    margin-left: 12px;
  }
</style>

<div class="textbox">
    <p class="text" in:fade>{prompt}</p>
    <div class="options">
      {#each filteredOptions as option, idx (option)}
        <button
          class="option"
          disabled={(option.disabledReasons ?? []).some(reason => reason.disabled($gameStateStore))}
          title={(option.disabledReasons ?? []).find(reason => reason.disabled($gameStateStore))?.reason}
          in:fade={{delay: 100 * idx}}
          on:click={() => selectIdx(idx)}
        >
          {option.text}
        </button>
      {/each}
    </div>
</div>