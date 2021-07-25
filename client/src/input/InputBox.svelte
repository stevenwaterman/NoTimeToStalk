<script lang="ts">
  import { gameStateStore } from "../statemachine/controller";
  import type { InputNode } from "../statemachine/controller";
  import { onMount } from "svelte";
  import { playSound } from "../soundEffects";

  export let node: InputNode;

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

  let value: string = "";

  function submit() {
    node.next(value, $gameStateStore);
  }

  let characters: number;
  $: characters = value.length;

  let minCharacters: number;
  $: minCharacters = node.inputLength.min;

  let maxCharacters: number;
  $: maxCharacters = node.inputLength.max;

  let charactersDenominator: number;
  $: charactersDenominator = characters > minCharacters ? maxCharacters : minCharacters;

  let charactersInvalid: boolean;
  $: charactersInvalid = characters < minCharacters || characters > maxCharacters;

  let submitTooltip: string;
  $: submitTooltip = characters < minCharacters ? "You need to write more" : characters > maxCharacters ? "You wrote too much" : "";
</script>

<style>
  .textbox {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid black;
    border-radius: 12px;
    position: fixed;
    top: min(60vh, calc(100vh - 350px));
    bottom: 5vh;
    left: 25vw;
    right: 25vw;
    padding: 10px;

    background-color: white;
  }

  .text {
    font-style: italic;
  }

  button {
    margin: 10px;
    align-self: flex-end;
    border: 1px solid black;
    cursor: pointer;
    padding: 2px;
    border-radius: 6px;
    background: white;
  }

  textarea {
    height: 100%;
    resize: none;
  }

  .row {
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
  }

  .invalid {
    color: red;
    font-weight: bold;
  }
</style>

<div class="textbox">
  <p class="text">{prompt} Enter between {minCharacters} and {maxCharacters} characters.</p>
  <textarea bind:value/>
  <div class="row">
    <span class:invalid={charactersInvalid}>{characters}/{charactersDenominator}</span>
    <button on:click={submit} disabled={charactersInvalid} title={submitTooltip}>Submit</button>
  </div>
</div>