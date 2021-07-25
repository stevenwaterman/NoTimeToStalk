<script lang="ts">
  import { nodeStore } from "../statemachine/state";

  let speaker: string | undefined;
  $: speaker = $nodeStore.speaker;
</script>

<style>
  .speaker {
    border: 1px solid black;
    border-radius: 12px;
    padding: 4px;
    font-size: 20pt;
    position: fixed;
    top: calc(70vh - 16px);
    left: calc(25vw + 10px);
    background-color: white;
    z-index: 1;
  }
</style>

{#if speaker}
  {#key speaker}
    <span class="speaker">
      {speaker}
    </span>
  {/key}
{/if}