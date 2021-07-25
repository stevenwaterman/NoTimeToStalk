<script lang="ts">
  import { weapons } from "../names";

  import type { Buffs, CharacterTimelineStep, Weapon } from "../statemachine/explore/explore";
  import { characterStateStore, characterStore } from "../statemachine/state";

  let characterState: CharacterTimelineStep;
  $: characterState = $characterStateStore

  let weapon: Weapon;
  $: weapon = characterState.weapon;

  let weaponVisible: boolean;
  $: weaponVisible = ["candlestick", "spade", "scythe", "umbrella", "lute"].includes(weapon)

  let buffs: Buffs;
  $: buffs = characterState.buffs;

  let currentBuffs: Array<keyof Buffs>;
  $: currentBuffs = Object.entries(buffs).filter(([_, value]) => value).map(([key]) => key as keyof Buffs);
</script>

<style>
  .box {
    border: 1px solid black;
    border-radius: 12px;
    padding: 10px;
    position: fixed;
    bottom: 10px;
    right: 10px;
    background-color: white;
    z-index: 1;
  }

  ul {
    margin: 0;
  }

  p {
    margin: 0;
  }
</style>

<div class="box">
  {#if weapon !== "nothing"}
    <p>
      Holding: {weapons[weapon]}
    </p>
  {/if}

  {#if weaponVisible}
    <p>
      Held item is visible to others
    </p>
  {/if}

  {#if currentBuffs.length}
    <p>You are:</p>
  {/if}

  <ul>
    {#each currentBuffs as buff}
      <li>{buff}</li>
    {/each}
  </ul>
  
</div>