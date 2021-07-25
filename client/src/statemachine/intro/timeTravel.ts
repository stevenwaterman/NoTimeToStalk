import { chapterStore, GraphNode, makeBackgrounds } from "../controller";
import { enterCar } from "../house/enterCar";
import { nodeStore } from "../state";

const backgrounds = makeBackgrounds("intro", [
  "enter", // Wide shot of the time travel chamber
  "chamber", // Shot from inside the chamber, looking over at lady
  "chamberTravel" // like chamber with added time travelyness 
])

export const timeTravelStart: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.enter,
  text: () => [
    "You've travelled nearly a hundred times now, but it still freaks you out.",
    "You're no stranger to modern technology, but time travel tech still seems... alien.",
    "Maybe it's all the glowing crystals."
  ],
  next: () => nodeStore.set(chamber)
}

const chamber: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.chamber,
  onEnter: () => chapterStore.set("introTimeTravel"),
  text: () => [
    "You enter the chamber.",
    "An eerie noise surrounds you."
  ],
  next: () => nodeStore.set(leaving)
}

const leaving: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.chamberTravel,
  sounds: [{ filePath: "effects/timeTravel" }],
  text: () => [
    "Your vision begins to fade...",
    "You feel your body become weightless..."
  ],
  next: () => nodeStore.set(enterCar)
}