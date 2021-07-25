<script lang="ts">
  import { chapterStore, gameStateStore } from "./statemachine/controller";
  import type { Chapter } from "./statemachine/controller";
  import Audio from "./Audio.svelte";
  import type { Locations } from "./statemachine/explore/explore";

  let chapter: Chapter;
  $: chapter = $chapterStore;

  let location: Locations;
  $: location = $gameStateStore.explore.characterState.location;
</script>

{#if chapter === "introStart"}
  <Audio filePath="music/Opening" volume={0.5} loop={true}/>
{:else if chapter === "introContext"}
  <Audio filePath="music/OpeningContext" volume={0.5} loop={true}/>
{:else if chapter === "introTimeTravel"}
  <Audio filePath="music/TimeTravel" volume={0.5} loop={true}/>
{:else if chapter === "enterCar"}
    <Audio filePath="effects/explore/ambiance/outside" loop={true} volume={0.5}/>
    <Audio filePath="music/HouseStart" volume={0.5} loop={true}/>
{:else if chapter === "enterHouse"}
  <Audio filePath="music/House" volume={0.5} loop={true}/>
{:else if chapter === "explore"}
  <Audio filePath="music/Explore" volume={0.5}/>

  {#if location === "garden" || location === "balcony" || location === "porch"}
    <Audio filePath="effects/explore/ambiance/outside" loop={true} volume={0.5}/>
  {:else if location === "lounge"}
    <Audio filePath="effects/explore/ambiance/lounge" loop={true} volume={0.5}/>
  {:else if location === "kitchen"}
    <Audio filePath="effects/explore/ambiance/kitchen" loop={true} volume={0.5}/>
  {:else if location === "dining" || location === "study"}
    <Audio filePath="effects/explore/ambiance/diningStudy" loop={true} volume={0.4}/>
  {:else if location === "bathroom"}
    <Audio filePath="effects/explore/ambiance/bathroom" loop={true} volume={1}/>
  {:else if location === "secretPassage"}
    <Audio filePath="effects/explore/ambiance/secretPassage" loop={true} volume={0.5}/>
  {/if}
{:else if chapter === "investigation"}
  <Audio filePath="music/Investigation" volume={0.5} loop={true}/>
{:else if chapter === "outroTimeTravel"}
  <Audio filePath="music/TimeTravel" volume={0.5} loop={true}/>
{:else if chapter === "outro"}
  <Audio filePath="music/FutureOutroStart" volume={0.5} loop={true}/>
{:else if chapter === "outroRando"}
  <Audio filePath="music/Rando" volume={0.5} loop={true}/>
{:else if chapter === "debrief"}
  <Audio filePath="music/Credits" volume={0.5} loop={true}/>
{/if}