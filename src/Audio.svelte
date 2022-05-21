<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { volumeStore } from "./statemachine/controller";
  import { pausedStore } from "./statemachine/state";
  import { fadeVolume } from "./effects/fadeVolume";

  export let filePath: string;
  export let autoplay: boolean = true;
  export let loop: boolean = false;
  export let volume: number = 1;
  let audio: HTMLAudioElement;

  pausedStore.subscribe(paused => {
    if (audio) {
      if (paused) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  });

  $: if (audio) audio.volume = $volumeStore * volume;

  const dispatch = createEventDispatcher();
  function ended() {
    dispatch("end");
  }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<audio controls={false} loop={loop} src={`/NoTimeToStalk/assets/audio/${filePath}.mp3`} autoplay={autoplay} bind:this={audio} on:ended={ended} out:fadeVolume/>