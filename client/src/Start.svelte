<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { apiUrl } from "./main";
  import type { ExploreCharacters } from "./statemachine/controller";
  import { fetchedStateStore, userInputStore } from "./statemachine/state";

  let name: string = "";
  let password: string = localStorage.getItem("password") || "";

  let valid: boolean;
  $: valid = name.length >= 3 && password.length === 36;

  const dispatch = createEventDispatcher();

  let request: Promise<Response> | null = null;

  function logIn() {
    localStorage.setItem("password", password);
    userInputStore.update(userInput => {
      userInput.name = name;
      return userInput;
    });
    request = fetch(`${apiUrl}/game?id=${password}`);
  }

  function checkDeath() {
    localStorage.setItem("password", password);
    fetch(`${apiUrl}/alive?id=${password}`).then(async response => {
      if (response.status === 200) {
        const body: {
          name: string;
          killed?: {
            time: Date;
            character: ExploreCharacters;
            reason: string;
            name: string;
          }
        } = await response.json();
        if (body.killed === undefined) {
          alert(`${body.name}, you are still alive. Good job!`);
        } else {
          alert(`${body.name}, you were killed by ${body.killed.character} at ${body.killed.time}. The player, ${body.killed.name}, gave this reason: ${body.killed.reason}`)
        }
      } else {
        alert(`${response.status} error`);
      }
    });
  }

  async function start(response: Response) {
    const body = await response.json();
    fetchedStateStore.set(body);
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
  {#if request}
    {#await request}
      <p>Logging in...</p>
    {:then response}
      {#if response.status === 200}
        <p>Logged In.</p>
        <p>In this game, your actions and inputs will be recorded and processed by an AI</p>
        <p>Please try to keep it PG!</p>
        <p>Do not close this tab until the game is complete, or you will lose all progress</p>
        <p>The game is designed to be played on a 16:9 desktop, full-screen (press f11)</p>
        <p>Everything else is untested</p>
        <button on:click="{() => start(response)}">Start</button>
      {:else if response.status === 403}
        <p>Incorrect Password</p>
      {:else}
        <p>HTTP Error - Status {response.status}</p>
      {/if}
    {:catch error}
      <p>Error: {error}</p>
    {/await}
  {:else}
    <p>Only one person can play the game at a time due to the resources required for the AI</p>
    <p>Therefore you need a one-time-use password to play</p>
    <p>Contact Steven on discord (Steven#3849) to arrange one!</p>
    <p style="margin-bottom: 20px;">The game lasts 30-45 minutes and must be completed in one sitting</p>

    <div class="row">
      <label for="name">Name:</label>
      <input id="name" bind:value={name} type="text" placeholder="Enter your name"/>
    </div>

    <div class="row">
      <label for="password">Password:</label>
      <input id="password" bind:value={password} type="password"/>
    </div>

    <div class="row">
      <button on:click={checkDeath} disabled={password.length !== 36}>Already Played</button>
      <button on:click={logIn} disabled={!valid}>First Time Playing</button>
    </div>
  {/if}
</div>

<!-- svelte-ignore a11y-missing-attribute -->
<img class="bg" src={'/assets/backgrounds/start.jpg'}/>