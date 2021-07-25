import { names } from "../../names";
import { characters } from "../characters";
import { chapterStore, GraphNode, makeBackgrounds } from "../controller";
import { nodeStore } from "../state";
import { timeTravelStart } from "./timeTravel";

const backgrounds = makeBackgrounds("intro", [
  "briefing1", // Show one of the two briefing areas
  "briefing2" // Show the other briefing area
]);

export const missionStart: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.briefing1,
  leftCharacterUrl: characters.futureLady.serious,
  speaker: names.futureLady,
  onEnter: () => chapterStore.set("introContext"),
  text: () => [
    "The Worthington Stalker was incredibly secretive, as serial killers tend to be.",
    "There's only one time and place we know they were for sure - at a dinner party hosted by Admiral Thomas - October 1920.",
    "The Admiral was an... interesting man. One of the best seamen of his generation, Admiral Thomas was notorious for much more than his seafaring prowess.",
    "He was best known for getting into a fistfight or bed with you on the night you met him, and he didn't mind which.",
    "He did appear to settle down in his later years, telling tales of his beautiful wife Cassandra and his two small children. There's never been any reports of him with them in public, though - he was only ever seen with a pack of dogs trailing him.",
    "His absence in the mid to late-1910s was also notable, as it led to rumours he was involved in piracy and illegal nautical activity. He came forward in January 1920 with diary records and a report to clear his name, which did the job.", 
    "This public interrogation seemed to throw him off and turn him into a recluse. The October 1920 party was the first event he attended in almost four years.",
  ],
  next: () => nodeStore.set(missionStart2)
}

const missionStart2: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.briefing1,
  leftCharacterUrl: characters.futureLady.sly,
  speaker: names.you,
  text: () => [
    "I've heard of Admiral Thomas - wasn't he the one that got murdered at a dinner party?",
    "I think the pieces are starting to fall into place for me..."
  ],
  next: () => nodeStore.set(missionStart3)
}

const missionStart3: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.briefing1,
  leftCharacterUrl: characters.futureLady.serious,
  speaker: names.futureLady,
  text: () => [
    "Yes, it was quite tragic.",
    "We believe that the Worthington Stalker murdered Admiral Thomas that night at the party.",
    "That's where you come in. Your task is to travel back in time to the dinner party, find the Worthington Stalker, and have them arrested."
  ],
  next: () => nodeStore.set(missionStart5)
}

const missionStart5: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.briefing1,
  leftCharacterUrl: characters.futureLady.desperate,
  speaker: names.you,
  text: () => [
    "Woah, woah, woah, WOAH...",
    "When I went through time travel training, they were VERY clear.",
    "I even took an oath!",
    "Under no circumstances will I change the past, whether accidental or deliberate, to prevent the creation of a time paradox which would consume the entire universe."
  ],
  next: () => nodeStore.set(missionStart6)
}

const missionStart6: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.briefing1,
  leftCharacterUrl: characters.futureLady.desperate,
  speaker: names.futureLady,
  text: () => [
    "In this case, we have permission. People over my head have looked into it, and the Government approved it. Just try not to mess up the past TOO much?",
  ],
  next: () => nodeStore.set(missionStart6b)
}

const missionStart6b: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.briefing2,
  leftCharacterUrl: characters.futureLady.serious,
  speaker: names.futureLady,
  text: state => [
    `The dinner party takes place on the 11th of October, 1920. You'll be attending as one of the guests: ${names[state.character]}.`
  ],
  next: state => nodeStore.set({
    host: blackIntro,
    dog: blackIntro,
    black: blackIntro,
    blue: blueIntro,
    green: greenIntro,
    pink: pinkIntro,
    red: redIntro,
    yellow: yellowIntro
  }[state.character])
}


const blackIntro: GraphNode = {
  type: "INTRO",
  character: "black",
  next: () => nodeStore.set(missionStart8)
}

const blueIntro: GraphNode = {
  type: "INTRO",
  character: "blue",
  next: () => nodeStore.set(missionStart8)
}

const greenIntro: GraphNode = {
  type: "INTRO",
  character: "green",
  next: () => nodeStore.set(missionStart8)
}

const pinkIntro: GraphNode = {
  type: "INTRO",
  character: "pink",
  next: () => nodeStore.set(missionStart8)
}

const redIntro: GraphNode = {
  type: "INTRO",
  character: "red",
  next: () => nodeStore.set(missionStart8)
}

const yellowIntro: GraphNode = {
  type: "INTRO",
  character: "yellow",
  next: () => nodeStore.set(missionStart8)
}

const missionStart8: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.briefing2,
  leftCharacterUrl: characters.futureLady.serious,
  speaker: names.futureLady,
  text: () => [
    "You'll arrive in the car, on your way to the manor. You'll know it when you see it.",
    "Get to know the others at the party, and look around for any clues.",
    "Feel free to make up a backstory, just remember you're from the past.",
    "Admiral Thomas was murdered at exactly 6:31pm, so keep an eye on the time.",
    "After the murder, call the police, and a detective will arrive.",
    "You need a solid alibi to gain the detective's trust, so make sure you're not the one acting suspicious that night.",
    "Once you have his trust, present your evidence and convince him who the killer is.",
    "Then we'll pull you out, and you can leave today much richer than when you arrived.",
    "Got it?"
  ],
  next: () => nodeStore.set(missionStart9)
}

const missionStart9: GraphNode = {
  type: "OPTION",
  backgroundUrl: backgrounds.briefing2,
  leftCharacterUrl: characters.futureLady.smile,
  prompt: "Got it?",
  options: [
    {
      text: "No, say that again?",
      next: () => nodeStore.set(again)
    },
    {
      text: "Yes, let's go.",
      next: () => nodeStore.set(timeTravelStart)
    }
  ],
}

const again: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.briefing2,
  leftCharacterUrl: characters.futureLady.desperate,
  text: () => ["Pay attention this time, will you?"],
  next: () => nodeStore.set(missionStart6b)
}