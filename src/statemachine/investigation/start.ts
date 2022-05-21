import { names } from "../../names";
import { characters } from "../characters";
import { chapterStore, GraphNode, makeBackgrounds } from "../controller";
import { nodeStore } from "../state";
import { seriousStart } from "./serious";

const backgrounds = makeBackgrounds("investigation", [
  "hostDead", // The Admiral is dead on the ground
  "waiting", // Everyone is in the lounge, looking stressed
  "detectiveArrive", // Car pulls up to the house
  "detectiveWalksIn", // Detective enters the house 
  "lounge"
]);

export const investigationStart: GraphNode = {
  type: "MONOLOGUE",
  sounds: [{ filePath: "effects/investigation/dogFoundBody", delay: 0.5}],
  text: () => [
    "The lights go out.", 
    "You hear Goldie barking.", 
    "Something must be wrong.", 
  ],
  next: state => {
    if(state.explore.characterState.location === "dining") nodeStore.set(investigationDining);
    else nodeStore.set(investigationElsewhere);
  }
}

const investigationElsewhere: GraphNode = {
  type: "MONOLOGUE",
  sounds: [{ filePath: "effects/investigation/running", volume: 0.5}],
  text: () => [
    "You run towards the sound, trying to navigate the house in the darkness.",
    "It's coming from the dining room."
  ],
  next: () => nodeStore.set(hostDead)
}

const investigationDining: GraphNode = {
  type: "MONOLOGUE",
  sounds: [{ filePath: "effects/investigation/struggle", delay: 0.5, volume: 0.5},
    { filePath: "effects/investigation/fall", delay: 1.5, volume: 0.7}],
  text: () => [
    "There seems to be some kind of struggle in the dining room with you.",
    "You hear a thud, like a sack of potatoes dumped on the ground from a height.",
    "You fumble around in the dark, trying to get your bearings and figure out what is going on."
  ],
  next: () => nodeStore.set(hostDead)
}

const hostDead: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.hostDead,
  sounds: [{ filePath: "effects/investigation/dead", delay: 0.5}],
  text: () => ["The lights come back on, and Admiral Thomas is lying on the ground, dead."],
  next: () => nodeStore.set(panic)
}

const panic: GraphNode = {
  type: "MONOLOGUE",
  onEnter: () => chapterStore.set("investigation"),
  backgroundUrl: backgrounds.hostDead,
  sounds: [{filePath: "effects/investigation/panic"}],
  text: () => [
    "The room erupts into blind panic.", 
    "People are sobbing, shouting, screaming.",
    "You decide to take control of the situation."
  ],
  next: () => nodeStore.set(shouting)
}

const shouting: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.hostDead,
  speaker: names.you,
  text: () => [
    "QUIET!!!"
  ],
  next: () => nodeStore.set(quiet)
}

const quiet: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.hostDead,
  text: () => [
    "The chaos settles down."
  ],
  next: () => nodeStore.set(movePeople)
}

const movePeople: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.hostDead,
  speaker: names.you,
  text: () => [
    "Let's all take a breath, and move through to the lounge.",
    "Nobody touch anything, and leave this crime scene as it is."
  ],
  next: () => nodeStore.set(loungeStress)
}

const loungeStress: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.waiting,
  text: () => [
    "You walk the guests into the lounge, and lock the door, leaving the crime scene undisturbed.",
  ],
  next: () => nodeStore.set(callPolice)
}

const callPolice: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.waiting,
  sounds: [{filePath: "effects/investigation/phone"},
    { filePath: "effects/investigation/detectiveArrives", delay: 3 }],
  text: () => [
    "You call the police, reporting that Admiral Thomas has died under suspicious circumstances.",
    "Under any other circumstance, you'd be delighted at the opportunity to use a telephone, nevermind a ROTARY telephone!",
    "They're not very fast in an emergency though.",
    "The detective is on his way.",
    "It's a long, painful wait..."
  ],
  next: () => nodeStore.set(detectiveArrives)
}

const detectiveArrives: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.detectiveArrive,
  text: () => ["Eventually, you hear the detective's car arrive."],
  next: () => nodeStore.set(detectiveWalksIn)
}

const detectiveWalksIn: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.detectiveWalksIn,
  speaker: "???",
  text: () => [`Good evening ladies and gentlemen. My name is ${names.investigator}.`],
  next: () => nodeStore.set(detectiveIntro)
}

const detectiveIntro: GraphNode = {
  type: "INTRO",
  character: "investigator",
  next: () => nodeStore.set(detectiveCalms)
}

const detectiveCalms: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.serious,
  speaker: names.investigator,
  text: () => [
    "I have been called to this home following the death, and suspected murder, of Admiral Thomas.",
    "First, you should take a breath, and calm yourselves down.",
    "It's going to be a long night."
  ],
  next: () => nodeStore.set(seriousStart)
}
