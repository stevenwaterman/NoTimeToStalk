import { chapterStore, GraphNode, makeBackgrounds } from "../controller";
import { nodeStore, timeStore } from "../state";
import { atriumStart } from "./atrium";

const backgrounds = makeBackgrounds("atrium", [
  "wide"
])

export const exploreStart: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide,
  text: () => [
    "In this next section you will explore the house.",
    "Time passes in real-time, so be quick but thorough before that 6:31pm *dead*line. Click the pause button in the top right if you need to!",
    "Try to find who the murderer is, but don't act suspicious yourself.",
    "The top of the screen displays the other characters in the room with you. If their portrait shows an exclamation mark, they are being suspicious.",
    "To look at another character in the room, click on their portrait at any time.",
    "Some options might be greyed out - those are too suspicious to do while the Admiral is in the room with you."
  ],
  next: () => {
    timeStore.unpause();
    chapterStore.set("explore");
    nodeStore.set(atriumStart);
  }
}