<script lang="ts">
  import { timeStore } from "../statemachine/state";

  let time: number;
  $: time = $timeStore.time;

  let minutes: number;
  $: minutes = 9 + (20 + time) / 60;

  let seconds: number;
  $: seconds = (20 + time) % 60;

  let minuteString: string;
  $: minuteString = Math.floor(minutes).toString().padStart(2, "0");

  let secondString: string;
  $: secondString = seconds.toString().padStart(2, "0");
</script>

<style>
  .time {
    border: 1px solid black;
    border-radius: 12px;
    padding: 4px;
    font-size: 20pt;
    position: fixed;
    top: calc(70vh - 16px);
    right: calc(25vw + 10px);
    background-color: white;
    z-index: 1;
  }
</style>

<span class="time">
  6:{minuteString}:{secondString} PM
</span>