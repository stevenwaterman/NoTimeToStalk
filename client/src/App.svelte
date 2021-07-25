<script lang="ts">
  import Controller from "./Controller.svelte";
  import Start from "./Start.svelte";

  let started: boolean = false;
</script>

<style>
  :global(body) {
    background-color: black;
    user-select: none;
    font-size: 16pt;
  }
</style>

{#if started}
  <Controller/>
{:else}
  <Start on:start="{() => {started = true;}}"/>
{/if}
 