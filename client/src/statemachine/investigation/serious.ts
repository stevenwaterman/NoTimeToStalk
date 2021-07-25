import { names } from "../../names";
import { characters } from "../characters";
import { chapterStore, ExploreCharacters, GraphNode, makeBackgrounds, Option, postInfo } from "../controller";
import { alibiCharacter, lookAroundCharacter } from "../explore/explore";
import { outroStart } from "../outro/start";
import { nodeStore, userInputStore } from "../state";

const backgrounds = makeBackgrounds("investigation", [
  "waiting", // Everyone waiting nervously in the lounge 
  "lounge", // Lounge wide shot, probably of the fireplace, so it's not weird when you can't see anyone
  "atrium", // Atrium wide shot
  "timeTravel" // lounge + some weird time travel effects
]);

export const seriousStart: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.waiting,
  text: () => [
    "You wait with the others in the lounge while the detective inspects the Dining Room.",
    "You can't see what is happening, but you wait in a quiet tension.",
    "After some time, the detective returns."
  ],
  next: () => nodeStore.set(serious)
}

const serious: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.speaking,
  speaker: names.investigator,
  text: () => [
    "Admiral Thomas has died under suspicious circumstances.",
    "The cause of death is unknown.", 
    "He experienced blunt force trauma to the back of his head, but there is no way to know if that was the *cause* of his death, or merely a consequence of his collapse.", 
    "Tell me, did anyone witness the Admiral's death?"
  ],
  next: () => nodeStore.set(witnessDeath)
}

const witnessDeath: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.listening,
  speaker: names.you,
  text: () => ["There was a power cut - the lights went out. Nobody could have seen anything."],
  next: () => nodeStore.set(detained)
}

const detained: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.speaking,
  speaker: names.investigator,
  text: state => [
    "I see. In that case, I am hereby detaining everyone in this room on the suspicion of murder.", 
    "Do not speak unless spoken to, do not leave until released.",
    "We are going to get to the bottom of this. Tonight.",
    `${names[state.character]}, tell me, what did you do this evening, and what evidence do you have of your innocence?`
  ],
  next: () => nodeStore.set(alibi)
}

const alibi: GraphNode = {
  type: "INPUT",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.neutral,
  prompt: "What did you do while exploring the house? Convince the detective that you can't have been the murderer. Please only talk about yourself, the Admiral, and Goldie. Don't mention the other guests, as this will confuse the AI.",
  inputLength: {
    min: 200,
    max: 500
  },
  next: input => {
    userInputStore.update(state => {
      state.alibi = input.replace(/\n/g, " ");
      return state;
    })
    nodeStore.set(alibiGiven)
  }
}

const alibiGiven: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.speaking,
  speaker: names.investigator,
  text: () => ["Thank you. Who's next?"],
  next: state => state.character === "black" ? nodeStore.set(blueAlibi) : nodeStore.set(blackAlibi)
}

const blackAlibi: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.listening,
  rightCharacterUrl: characters.black.nervous,
  speaker: names.black,
  text: state => [alibiCharacter("black", state), `It can't have been me, ${state.alibis.black}`],
  next: state => state.character === "blue" ? nodeStore.set(greenAlibi) : nodeStore.set(blueAlibi)
}

const blueAlibi: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.listening,
  rightCharacterUrl: characters.blue.nervous,
  speaker: names.blue,
  text: state => [alibiCharacter("blue", state), `It can't have been me, ${state.alibis.blue}`],
  next: state => state.character === "green" ? nodeStore.set(redAlibi) : nodeStore.set(greenAlibi)
}

const greenAlibi: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.listening,
  rightCharacterUrl: characters.green.nervous,
  speaker: names.green,
  text: state => [alibiCharacter("green", state), `It can't have been me, ${state.alibis.green}`],
  next: state => state.character === "red" ? nodeStore.set(yellowAlibi) : nodeStore.set(redAlibi)
}

const redAlibi: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.listening,
  rightCharacterUrl: characters.red.nervous,
  speaker: names.red,
  text: state => [alibiCharacter("red", state), `It can't have been me, ${state.alibis.red}`],
  next: state => state.character === "yellow" ? nodeStore.set(pinkAlibi) : nodeStore.set(yellowAlibi)
}

const yellowAlibi: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.listening,
  rightCharacterUrl: characters.yellow.nervous,
  speaker: names.yellow,
  text: state => [alibiCharacter("yellow", state), `It can't have been me, ${state.alibis.yellow}`],
  next: state => state.character === "pink" ? nodeStore.set(alibisDone) : nodeStore.set(pinkAlibi)
}

const pinkAlibi: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.listening,
  rightCharacterUrl: characters.pink.nervous,
  speaker: names.pink,
  text: state => [alibiCharacter("pink", state), `It can't have been me, ${state.alibis.pink}`],
  next: () => nodeStore.set(alibisDone)
}

const alibisDone: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.lounge,
  leftCharacterUrl: characters.investigator.speaking,
  speaker: names.investigator,
  text: state => ["Thank you.", `Having heard all of your alibis, I would like to talk to ${names[state.character]} in the atrium.`],
  next: () => nodeStore.set(enterAtrium)
}

const enterAtrium: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.investigator.serious,
  text: () => ["You take a deep breath as you enter the atrium - is he about to arrest you?"],
  next: () => nodeStore.set(talkInAtrium)
}


const talkInAtrium: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.investigator.speaking,
  speaker: names.investigator,
  text: () => [
    "I believe that it wasn't you. Having heard your alibi, and knowing that you were the one to call us, I trust you.",
    "So that leads to my next question...",
    "Who do YOU think murdered Admiral Thomas, and why?"
  ],
  next: () => nodeStore.set(accuse)
}

function createAccuseOption(character: ExploreCharacters): Option {
  return {
    text: names[character],
    next: () => {
      userInputStore.update(state => {
        state.accused = character;
        return state;
      })
      nodeStore.set(reason);
    },
    visible: state => state.character !== character
  };
}

const accuse: GraphNode = {
  type: "OPTION",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.investigator.neutral,
  prompt: "Who do you think is the murderer?",
  options: ["black", "blue", "green", "pink", "red", "yellow"].map(createAccuseOption)
}

const reason: GraphNode = {
  type: "INPUT",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.investigator.neutral,
  inputLength: {
    min: 200,
    max: 500
  },
  prompt: "Why do you think it was them?",
  next: input => {
    userInputStore.update(state => {
      state.accusedReason = input;
      return state;
    });
    postInfo();
    nodeStore.set(detectiveAgrees)
  }
}

const detectiveAgrees: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.investigator.serious,
  speaker: names.investigator,
  text: () => ["Hmm...", "Yes, I think you are right.", "Thank you for all your help."],
  next: state => nodeStore.set(createArrest(state.userInput.accused))
}

function createArrest(accused: ExploreCharacters): GraphNode {
  const arrestedLeaves: GraphNode = {
    type: "MONOLOGUE",
    backgroundUrl: backgrounds.lounge,
    leftCharacterUrl: characters.investigator.serious,
    rightCharacterUrl: characters[accused]["angry"],
    text: () => [`${names.investigator} binds ${names[accused]} in a pair of handcuffs, and walks them out of the house.`],
    next: () => nodeStore.set(timeTravel)
  }

  return {
    type: "MONOLOGUE",
    backgroundUrl: backgrounds.lounge,
    leftCharacterUrl: characters.investigator.speaking,
    rightCharacterUrl: characters[accused]["nervous"],
    speaker: names.investigator,
    text: () => [
      `${names[accused]}, you're under arrest on suspicion of murder.`,
      "As for everyone else, you're free to go."
    ],
    next: () => nodeStore.set(arrestedLeaves)
  }
}

const timeTravel: GraphNode = {
  type: "MONOLOGUE",
  onEnter: () => chapterStore.set("outroTimeTravel"),
  sounds: [{ filePath: "effects/timeTravel", delay: 0.5}],
  backgroundUrl: backgrounds.timeTravel,
  text: () => [
    "You feel the familiar pull of the time machine retrieving you.",
    "Your time here is up."
  ],
  next: () => nodeStore.set(outroStart)
}
