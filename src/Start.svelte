<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { savedState } from "./savedState";
  // import { apiUrl } from "./main";
  import type { ExploreCharacters } from "./statemachine/controller";
  import { fetchedStateStore, userInputStore } from "./statemachine/state";
  import type { FetchedState } from "./statemachine/state";

  let name: string = "";

  const dispatch = createEventDispatcher();

  let state: FetchedState | null = null;

  function logIn() {
    userInputStore.update(userInput => {
      userInput.name = name;
      return userInput;
    });
    state = savedState;
    // request = fetch(`${apiUrl}/game?id=${password}`);
  }

  async function start(state: FetchedState) {
    fetchedStateStore.set(state);
    dispatch("start");
  }
</script>

<style>
  label {
    color: white;
  }

  p {
    color: white;
    margin: 4px;
  }

  input {
    margin: 20px;
  }

  button {
    margin: 20px;
  }

  .center {
    position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);

    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding-top: 12px;
    padding-left: 12px;
    padding-right: 12px;
    background-color: #111 ;
    text-align: center;
    border: 2px solid white;
    border-radius: 20px;
  }

  .bg {
    min-height: 100vh;
    min-width: 100vw;
    position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
  
  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-size: 60pt;
    color: white;
    text-decoration: underline;
    margin: 20px;
  }

  .subtitle {
    text-align: right;
    width: 100%;
  }

  a {
    color: lightblue;
    text-decoration: underline;
  }
</style>

<div class="center">
  <h1>No Time to Stalk!</h1>
  <p class="subtitle">A Game by Artie & Steven Waterman</p>
  <p class="subtitle" style="margin-bottom: 20px;">For the <a href="https://itch.io/jam/pridetharian21">Pridetharian Jam 2021</a></p>
  {#if state}
    <p>Logged In.</p>
    <p>In this game, your actions and inputs will be recorded and processed by an AI</p>
    <p>Please try to keep it PG!</p>
    <p>Do not close this tab until the game is complete, or you will lose all progress</p>
    <p>The game is designed to be played on a 16:9 desktop, full-screen (press f11)</p>
    <p>Make sure you can see the background images and hear the audio!</p>
    <p>Everything else is untested</p>
    <button on:click="{() => start(state)}">Start</button>
  {:else}
    <div class="row">
      <label for="name">Name:</label>
      <input id="name" bind:value={name} type="text" placeholder="Enter your name"/>
    </div>

    <div class="row">
      <button on:click={logIn}>Start Playing</button>
    </div>
  {/if}
</div>

<!-- svelte-ignore a11y-missing-attribute -->
<img class="bg" src={'/notimetostalk/assets/backgrounds/start.jpg'}/>