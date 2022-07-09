<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import type { ExploreCharacters, GraphNode, MonologueNode } from "../statemachine/controller";
  import { characters } from "../statemachine/characters";
  import { lookAroundCharacter } from "../statemachine/explore/explore";
  import { otherCharacterStateStore, characterStateStore, nodeStore } from "../statemachine/state";
  
  let source: GraphNode | null = null;

  function inspect(character: string, suspicious: boolean, originNode: GraphNode): MonologueNode {
    if (source === null) {
      source = originNode;
    }
    return {
      type: "MONOLOGUE",
      backgroundUrl: originNode.backgroundUrl,
      leftCharacterUrl: characters[character][suspicious ? "suspicious" : "neutral"],
      text: state => [lookAroundCharacter(character, "here", state.explore.otherCharacterState[character])],
      next: () => {
        nodeStore.set(source);
        source = null;
      }
    }
  }

  const indices: Record<ExploreCharacters, number> = {
    pink: 0,
    red: 1,
    yellow: 2,
    green: 3,
    blue: 4,
    black: 5,
    host: 6,
    dog: 7
  }

  let peopleHere: Record<ExploreCharacters, {idx: number; suspicious: boolean;}>;
  $: peopleHere = Object.entries($otherCharacterStateStore)
      .filter(entry => entry[1].location === $characterStateStore.location)
      .reduce((acc, [character, step]) => {
        acc[character as ExploreCharacters] = {
          idx: indices[character as ExploreCharacters],
          suspicious: step.suspicious
        };
        return acc;
      },
    {} as Record<ExploreCharacters, {idx: number; suspicious: boolean;}>);
</script>

<style>

  .container {
    height: 5vw;
    width: 5vw;
    position: fixed;
    top: 20px;
    cursor: pointer;
  }

  img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border: 2px solid black;
    box-sizing: border-box;
  }

  .button {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: none;
    width: 100%;
    height: 100%;
    z-index: 1;
    font-size: 40pt;
    text-align: center;
    border: 2px solid white;
    color: white;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: centere;
  }
</style>

{#each Object.entries(peopleHere) as [character, {idx, suspicious}] (character)}
  <div class="container" 
    style={`left: calc(26vw + ${6 * idx}vw)`} 
    on:click="{() => nodeStore.update(node => inspect(character, suspicious, node))}" 
    transition:fly|local={{y: -100}}
  >
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src={`/NoTimeToStalk/assets/avatars/${character}.jpg`}>
    {#if suspicious}
      <div class="button" transition:fade|local>!</div>
    {/if}
  </div>
{/each}
 