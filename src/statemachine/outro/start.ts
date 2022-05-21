import { names } from "../../names";
import { characters } from "../characters";
import { chapterStore, GraphNode, makeBackgrounds } from "../controller";
import { nodeStore } from "../state";
import { randoStart } from "./rando";

const backgrounds = makeBackgrounds("outro", [
  "timeTravel", // From inside the time travel chamber
  "timeRoom", // In the time machine room, wide-ish
  "inOffice" // Wide-ish in her office
]);

export const outroStart: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.timeTravel,
  text: () => [
    "You find yourself back in the time machine, exactly where you left. It seems like no time has passed at all.",
    `You leave the time machine and are greeted by ${names.futureLady}.`
  ],
  next: () => nodeStore.set(meetLady)
}

const meetLady: GraphNode = {
  type: "MONOLOGUE",
  onEnter: () => chapterStore.set("outro"),
  backgroundUrl: backgrounds.timeRoom,
  leftCharacterUrl: characters.futureLady.smile,
  speaker: names.futureLady,
  text: () => [
    "Welcome back, and congratulations on a job well done. You will find the payment in your account.", 
    "I'm sure you have many questions, and I'm happy to answer any of them. Come through to my office."
  ],
  next: () => nodeStore.set(inOffice)
}

const inOffice: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.neutral,
  speaker: names.futureLady,
  text: () => [
    "I'm sorry to have to ask that of you, but I must say you did a marvellous job and exceeded all our expectations.",
    "I hope you have a happy retirement, and look back on this as a necessary evil for a good life."
  ],
  next: () => nodeStore.set(askQuestion)
}

const askQuestion: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.neutral,
  speaker: names.you,
  text: () => [
    "Thank you. I do have one question.",
    "You mentioned during the briefing that the murder would happen at 6:31pm, but it actually happened at -"
  ],
  next: () => nodeStore.set(answerQuestion)
}

const answerQuestion: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.inOffice,
  leftCharacterUrl: characters.futureLady.neutral,
  speaker: names.futureLady,
  text: state => [
    "6:27pm?",
    "I remember briefing you that the murder would happen at 6:27pm, because in this timeline, it did. Evidently, your presence changed the course of events that evening.",
    `When the original ${names[state.character]} attended the party, they acted differently to you. Not in a bad way, just enough to slightly change the future.`,
    "Perhaps the killer was spooked by you, and acted more quickly, or maybe they had more time alone to prepare.",
    "Frankly, we'll never know the answer, and it doesn't matter, because you apprehended the kil..."
  ],
  next: () => nodeStore.set(randoStart)
}
