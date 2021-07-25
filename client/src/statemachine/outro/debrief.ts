import { names } from "../../names";
import { chapterStore, GraphNode, makeBackgrounds } from "../controller";
import { nodeStore } from "../state";

const backgrounds = makeBackgrounds("debrief", [
  "debrief" // Idk a logo or something
]);

export const debriefStart: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.debrief,
  onEnter: () => chapterStore.set("debrief"),
  speaker: "Steven",
  text: () => ["I imagine that you're a bit confused right now."],
  next: () => nodeStore.set(debriefStart2)
}

const debriefStart2: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.debrief,
  speaker: "Artie",
  text: () => ["I'm sorry, but we've been lying to you this whole time."],
  next: () => nodeStore.set(debriefStart3)
}

const debriefStart3: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.debrief,
  speaker: "Steven",
  text: state => [
    "There actually is no AI.",
    `${names[state.userInput.accused]} was a previous player - what they said and did around the manor was simply what that player said and did.`,
    "That goes for all the characters!",
    `The ${names[state.userInput.accused]} that you accused is now removed from the game, and whoever plays next will take over from them.`,
    `As for ${names[state.character]}, everything you did is what future players will see ${names[state.character]} do.`
  ],
  next: () => nodeStore.set(debriefStart4)
}

const debriefStart4: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.debrief,
  speaker: "Artie",
  text: () => [
    "The goal was never REALLY to find the murderer - it wasn't actually possible.",
    "But we also told you to not act suspicious.",
    "How suspicious were you?",
    "How long until one of the players convinces the detective that YOU were the murderer?",
    "THAT is the real game."
  ],
  next: () => nodeStore.set(debriefStart5)
}

const debriefStart5: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.debrief,
  speaker: "Steven",
  text: () => [
    "Come back later and use your password again to find out if you're still alive!",
    "If you want to play again to explore the house more, keep an eye out for the static version, which should release in a few weeks."
  ],
  next: () => nodeStore.set(debriefStart6)
}

const debriefStart6: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.debrief,
  speaker: "Steven & Artie",
  text: () => [
    "Thanks for playing!",
  ],
  next: () => nodeStore.set(debriefStart7)
}

const debriefStart7: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.debrief,
  text: () => [
    "Made by Steven & Artie Waterman for the Pridetharian Game Jam 2021",
    "SFX from freesounds",
    "Backgrounds and Characters made in The Sims 4",
    "Music from MuseNet (via MuseTree)",
    "Open Source on GitHub"
  ],
  next: () => nodeStore.set(debriefStart8)
}

const debriefStart8: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.debrief,
  text: () => [
    "Click to Quit"
  ],
  next: () => {location.reload()}
}
