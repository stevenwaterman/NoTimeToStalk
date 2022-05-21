<script lang="ts">
  import { timeStore } from "../statemachine/state";
  import { fade } from "svelte/transition";
  import { chapterStore, volumeStore } from "../statemachine/controller";

  let paused: boolean;
  $: paused = $timeStore.paused
</script>

<style>
  button {
    cursor: pointer;
    padding: 12px;
    background-color: white;
    border-radius: 12px;
  }

  .pause { 
    top: 10px;
    right: 10px;
    position: fixed;
  }

  .modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

</style>

{#if paused && $chapterStore === "explore"}
  <div class="modal" transition:fade on:click|stopPropagation>
    <button class="unpause" on:click={timeStore.unpause}>Unpause</button>
  </div>
{:else}
  <button class="pause" on:click={timeStore.pause}>Pause</button>
{/if}