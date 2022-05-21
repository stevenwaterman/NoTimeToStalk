import { names } from "../../names";
import { characters } from "../characters";
import { chapterStore, GraphNode, makeBackgrounds } from "../controller";
import { nodeStore } from "../state";
import { debriefStart } from "./debrief";

const backgrounds = makeBackgrounds("outro", [
  "burstIn", // Rando bursts into the room
  "inOffice", // Wide-ish in her office
  "whoopsie", // in future lady's office, she says whoopsie
]);

export const randoStart: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.burstIn,
  sounds: [{filePath: "effects/intro/door"}],
  text: () => [`${names.futureLady} is interrupted by someone bursting into her office, screaming.`],
  next: () => nodeStore.set(randoShout)
}

export const randoShout: GraphNode = {
  type: "MONOLOGUE",
  onEnter: () => chapterStore.set("outroRando"),
  leftCharacterUrl: characters.futureLady.shocked,
  rightCharacterUrl: characters.futureRando.angry,
  speaker: names.futureRando,
  backgroundUrl: backgrounds.inOffice,
  text: () => [
    "WHAT DID YOU DO THAT FOR?!"
  ],
  next: () => nodeStore.set(whoAreYou)
}

const whoAreYou: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.shocked,
  rightCharacterUrl: characters.futureRando.confused,
  speaker: names.you,
  text: () => ["Sorry, who are you?"],
  next: () => nodeStore.set(randoPoints)
}

const randoPoints: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.confused,
  rightCharacterUrl: characters.futureRando.desperate,
  speaker: names.futureRando,
  text: () => [
    "I'm the guy YOU sent to prison! 1920s prison!",
    "Do you know how bad it is in there?"
  ],
  next: () => nodeStore.set(confused)
}

const confused: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.confused,
  rightCharacterUrl: characters.futureRando.desperate,
  speaker: names.you,
  text: state => [`...I'm sorry, the only person I sent to prison was ${names[state.userInput.accused]}!`],
  next: () => nodeStore.set(keepUp)
}

const keepUp: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.confused,
  rightCharacterUrl: characters.futureRando.desperate,
  speaker: names.futureRando,
  text: () => ["Yes! That was me! Keep up!"],
  next: () => nodeStore.set(stalker)
}

const stalker: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.confused,
  rightCharacterUrl: characters.futureRando.desperate,
  speaker: names.you,
  text: state => [
    `But I thought ${names[state.userInput.accused]} was the Worthington Stalker...`,
    "Are YOU the Worthington Stalker?!"
  ],
  next: () => nodeStore.set(alsoHunting)
}

const alsoHunting: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.shocked,
  rightCharacterUrl: characters.futureRando.angry,
  speaker: names.futureRando,
  sounds: [{filePath: "effects/investigation/dead"}],
  text: () => [
    "No, I was trying to stop him!",
    "All of us were."
  ],
  next: () => nodeStore.set(alsoTimeTravelers)
}

const alsoTimeTravelers: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.shocked,
  rightCharacterUrl: characters.futureRando.angry,
  speaker: names.you,
  text: () => [
    "All of the guests were time travellers?",
    "Then who was the killer?"
  ],
  next: () => nodeStore.set(detective)
}

const detective: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.shocked,
  rightCharacterUrl: characters.futureRando.desperate,
  speaker: names.futureRando,
  text: () => ["The Detective, you idiot."],
  next: () => nodeStore.set(helpedHim)
}

const helpedHim: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.confused,
  rightCharacterUrl: characters.futureRando.desperate,
  speaker: names.you,
  text: () => ["I... *helped* the Worthington Stalker?"],
  next: () => nodeStore.set(goodGuy)
}

const goodGuy: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.desperate,
  rightCharacterUrl: characters.futureRando.desperate,
  speaker: names.you,
  text: () => [`${names.futureLady}, YOU TOLD ME he was a good guy!`],
  next: () => nodeStore.set(whoopsie)
}

const whoopsie: GraphNode = {
  type: "MONOLOGUE",
  onEnter: () => chapterStore.set("whoopsie"),
  backgroundUrl: backgrounds.whoopsie,
  sounds: [{filePath: "effects/rando/whoopsie"}],
  speaker: names.futureLady,
  text: () => ["Whoopsie!"],
  next: () => nodeStore.set(debriefStart)
}
