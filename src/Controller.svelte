<script lang="ts">
  import Monologue from "./input/Monologue.svelte";
  import OptionBox from "./input/OptionBox.svelte";
  import Intro from "./input/Intro.svelte";
  import InputBox from "./input/InputBox.svelte";
  import Speaker from "./input/Speaker.svelte";
  import Time from "./input/Time.svelte";
  import PeopleHere from "./input/PeopleHere.svelte";
  import { fade, fly } from "svelte/transition";
  import StateInfo from "./input/StateInfo.svelte";
  import { nodeStore, timeStore } from "./statemachine/state";
  import type { GraphNode } from "./statemachine/controller";
  import { chapterStore } from "./statemachine/controller";
  import Pause from "./input/Pause.svelte";
  import Music from "./Music.svelte";
  import SoundEffects from "./SoundEffects.svelte";
  import { investigationStart } from "./statemachine/investigation/start";

  $: if ($timeStore.time >= 1070) {
    chapterStore.set("lightsOut");
    timeStore.pause();
    nodeStore.set(investigationStart);
  }

  let node: GraphNode;
  $: node = $nodeStore;

  let leftCharacterUrl: string | undefined;
  $: leftCharacterUrl = $nodeStore.leftCharacterUrl;

  let rightCharacterUrl: string | undefined;
  $: rightCharacterUrl = $nodeStore.rightCharacterUrl;

  let backgroundUrl: string | undefined;
  $: backgroundUrl = $nodeStore.backgroundUrl;
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

  .leftChar {
    position: fixed;
    max-height: 90vh;
    max-width: 40vw;
    height: 100%;
    width: 100%;
    object-fit: contain;
    bottom: 0;
    left: 0;
  }

  .rightChar {
    position: fixed;
    max-height: 90vh;
    max-width: 40vw;
    height: 100%;
    width: 100%;
    object-fit: contain;
    bottom: 0;
    right: 0;
    transform: scaleX(-1);
  }
</style>

<Music/>
<SoundEffects/>
<Speaker/>

{#if $chapterStore === "explore"}
  <Time/>
  <StateInfo/>
  <PeopleHere/>
  <Pause/>
{/if}

{#if leftCharacterUrl}
  {#key leftCharacterUrl}
    <!-- svelte-ignore a11y-missing-attribute -->
    <img transition:fly={{x: -200}} class="leftChar" src={leftCharacterUrl}/>
  {/key}
{/if}

{#if rightCharacterUrl}
  {#key rightCharacterUrl}
    <!-- svelte-ignore a11y-missing-attribute -->
    <img transition:fly={{x: -200}} class="rightChar" src={rightCharacterUrl}/>
  {/key}
{/if}

<div class="bgContainer">
  {#if backgroundUrl}
    {#key backgroundUrl}
      <!-- svelte-ignore a11y-missing-attribute -->
      <img transition:fade={{duration: 700}} class="bg" src={backgroundUrl}/>
    {/key}
  {/if}
</div>


{#key node}
  {#if node.type === "MONOLOGUE"}
    <Monologue node={node}/>
  {:else if node.type === "INPUT"}
    <InputBox node={node}/>
  {:else if node.type === "OPTION"}
    <OptionBox node={node}/>
  {:else if node.type === "INTRO"}
    <Intro node={node}/>
  {/if}
{/key}