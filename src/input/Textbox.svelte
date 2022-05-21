<script lang="ts">
  import { typewriter } from "../effects/typewriter";
  import AnimatedEllipsis from "./AnimatedEllipsis.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let text: string;

  let skipTypewriter: boolean = false;
  let showEllipsis: boolean = false;

  const dispatch = createEventDispatcher();
  
  function next() {
    if(showEllipsis) {
      dispatch('next');
    } else {
      skipTypewriter = true;
      showEllipsis = true;
    }
  }
</script>

<style>
  .textbox {
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    position: fixed;
    border-radius: 12px;
    top: 70vh;
    bottom: 5vh;
    left: 25vw;
    right: 25vw;
    padding: 20px;

    cursor: pointer;
    background-color: white;
    overflow-y: auto;
  }

  .text {
    height: 100%;
    margin-top: 20px;
    margin-bottom: 0;
  }
</style>

<div class="textbox" on:click={next}>
  {#if skipTypewriter}
    <p class="text">{text}</p>
  {:else}
    <p class="text" in:typewriter on:introend={() => showEllipsis = true}>{text}</p>
  {/if}

  {#if showEllipsis}
    <AnimatedEllipsis/>
  {/if}
</div>