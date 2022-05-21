import { names } from "../../names";
import { chapterStore, GraphNode, makeBackgrounds } from "../controller";
import { nodeStore } from "../state";
import { enterHouse } from "./enterHouse";

const backgrounds = makeBackgrounds("enterCar", [
  "landInCar", // Shot of inside a car
  "manorInDistance", // From the road, looking over at the manor
  "getOutOfCar", // Shot of the front door, from the drive
  "manorUpClose1", // Shots of the manor after you arrive (can be mulitple - whatever you wanna talk about)
  "manorUpClose2", // Shots of the manor after you arrive (can be mulitple - whatever you wanna talk about)
  "manorUpClose3", // Shots of the manor after you arrive (can be mulitple - whatever you wanna talk about)
  "frontDoor" // Close up of front door, after you arrive
])

export const enterCar: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.landInCar,
  onEnter: () => chapterStore.set("enterCar"),
  text: () => [
    `...and you arrive. You've landed in the car, just as ${names.futureLady} promised.`,
    "It's surprisingly nice, at least compared to the usual jobs involving medieval peasantry. You could get used to this."
  ],
  next: () => nodeStore.set(enterCar2)
}

const enterCar2: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.manorInDistance,
  sounds: [{filePath: "effects/enterCar/spooky"}],
  text: () => ["You're almost there now. The manor looms in the distance."],
  next: () => nodeStore.set(enterCar3)
}

const enterCar3: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.getOutOfCar,
  text: () => ["As you arrive and get out of the car, the manor appears even spookier than before."],
  next: () => nodeStore.set(manorUpClose1)
}

const manorUpClose1: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.manorUpClose1,
  text: () => [
    "Standing in front of you is a large stone building nestled within a stunning, yet eerie forest."
  ],
  next: () => nodeStore.set(manorUpClose2)
}

const manorUpClose2: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.manorUpClose2,
  text: () => [
    "The autumnal darkness of this night makes it feel like you've stepped into a horror movie.",
    "Hopefully you're wrong about that..."
  ],
  next: () => nodeStore.set(manorUpClose3)
}

const manorUpClose3: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.manorUpClose3,
  text: () => [
    "The front of the manor is shadowed by a layer of creeping ivy, running up the center of the building.",
    "Either side, the rows of dark windows reinforce that this is not the kind of place you want to spend an evening."
  ],
  next: () => nodeStore.set(enterCar6)
}

const enterCar6: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.frontDoor,
  sounds: [
    {
      filePath: "effects/enterCar/dogBarking",
      delay: 0.7
    }
  ],
  text: () => [
    "You let out a deep breath as you walk up to the door, causing a dog inside the house to go berserk.",
    "You mentally prepare yourself to ring the doorbell to this murder mansion."
  ],
  next: () => nodeStore.set(enterHouse)
}
