import { names } from "../../names";
import { characters } from "../characters";
import { chapterStore, GraphNode, makeBackgrounds } from "../controller";
import { nodeStore } from "../state";
import { missionStart } from "./mission";

const backgrounds = makeBackgrounds("intro", [
  "satWaiting", // First person view of sat in empty office
  "officeWide" // Wide shot of the office
]);

export const introStart: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.satWaiting,
  onEnter: () => chapterStore.set("introStart"),
  text: () => [
    "It's been a long time since she's called me back here to speak in person. It must be something important.", 
    "Mind you, it can't be that important when she's half an hour late...",
    "Ignoring that, I've been working with her for 4 years now. She hasn't let me down yet.",
    "Still - 400 million credits for one job? I should've known something was wrong.",
    "It's hard to be patient when it's all so tense."
  ],
  next: () => nodeStore.set(introStart2)
}

const introStart2: GraphNode = {
  type: "MONOLOGUE",
  sounds: [{filePath: "effects/intro/door", volume: 0.3}],
  backgroundUrl: backgrounds.satWaiting,
  leftCharacterUrl: characters.futureLady.smile,
  speaker: "???",
  text: () => ["Ahh, on time as always, I see. Sorry I couldn't be here in person..."],
  next: () => nodeStore.set(introStart3)
}

const introStart3: GraphNode = {
  type: "INTRO",
  character: "futureLady",
  next: () => nodeStore.set(introStart4)
}

const introStart4: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.smile,
  speaker: names.futureLady,
  text: () => [
    "Look, I'm going to be honest with you here. This job... It's not your usual line of work.",
    "It's not mine, either, but the pay is good. We're even working for the good guys for a change.",
    "What's more, I've already accepted, so I need you on board."
  ],
  next: () => nodeStore.set(introStart5)
}

const introStart5: GraphNode = {
  type: "OPTION",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.smile,
  prompt: "What do you want to say?",
  options: [
    {
      text: "Count me in",
      next: () => nodeStore.set(countMeIn)
    },
    {
      text: "Tell me more",
      next: () => nodeStore.set(tellMeMore)
    },
    {
      text: "No thanks",
      next: () => nodeStore.set(noThanks)
    }
  ],
}

const countMeIn: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.smile,
  speaker: names.you,
  text: () => ["Ok, count me in boss. Let's go!"],
  next: () => nodeStore.set(missionIntro)
}

const tellMeMore: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.smile,
  speaker: names.you,
  text: () => ["Ok, I need to hear more about this. What, you want me to go back to the pyramids again? It's just a big pile of rocks. I promise you, there's no evidence that aliens were involved whatsoever."],
  next: () => nodeStore.set(tellMeMore2)
}

const tellMeMore2: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.neutral,
  speaker: names.futureLady,
  text: () => ["No, not this time."],
  next: () => nodeStore.set(missionIntro)
}

const noThanks: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.smile,
  speaker: names.you,
  text: () => ["Look, I'm a specialist for a reason. If it's not my usual line of work, hire someone else. Someone that actually wants to do that kind of wo..."],
  next: () => nodeStore.set(noThanks2)
}

const noThanks2: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.desperate,
  speaker: names.futureLady,
  text: () => [
    "I don't trust anyone else!",
    "It's 400 million credits. You can retire. One job.",
    "Please."
  ],
  next: () => nodeStore.set(noThanks3)
}

const noThanks3: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.neutral,
  speaker: names.you,
  text: () => ["...If you insist."],
  next: () => nodeStore.set(missionIntro)
}

const missionIntro: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.neutral,
  speaker: names.futureLady,
  text: () => ["Tell me, what do you know about the Worthington Stalker?"],
  next: () => nodeStore.set(missionIntro2)
}

const missionIntro2: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.neutral,
  speaker: names.you,
  text: () => ["What, the serial killer?!", "You want me to go and interview a serial killer?!"],
  next: () => nodeStore.set(missionIntro3)
}

const missionIntro3: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.neutral,
  speaker: names.futureLady,
  text: () => ["No, not exactly..."],
  next: () => nodeStore.set(missionIntro4)
}

const missionIntro4: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.neutral,
  speaker: names.you,
  text: () => [
    "Right, I've got two problems with this straight away.", 
    "ONE, there is NO way I'm going back in time to interview a SERIAL KILLER.", 
    "And number TWO, how do you expect me to interview someone when we don't even know who it is? They was never caught, their identity never found. Do you expect me to become law enforcement too now? Go and catch a serial killer so I can do an interview for you? This is getting ridicu-"
  ],
  next: () => nodeStore.set(missionIntro5)
}

const missionIntro5: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.sly,
  speaker: names.futureLady,
  text: () => [
    "You're right, that would be ridiculous.",
    "No, I don't expect you to interview the killer."
  ],
  next: () => nodeStore.set(missionIntro6)
}

const missionIntro6: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.sly,
  speaker: names.you,
  text: () => [
    "...",
  ],
  next: () => nodeStore.set(missionIntro7)
}

const missionIntro7: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.sly,
  speaker: names.futureLady,
  text: () => ["Just apprehending them is fine thanks."],
  next: () => nodeStore.set(missionIntro8)
}

const missionIntro8: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.sly,
  speaker: names.you,
  text: () => ["...", "That was the bit I was concerned about!"],
  next: () => nodeStore.set(missionIntro9)
}

const missionIntro9: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.desperate,
  speaker: names.futureLady,
  text: () => [
    "I wish I didn't have to ask you, believe me.", 
    "Please, at least consider it."
  ],
  next: () => nodeStore.set(missionIntro10)
}

const missionIntro10: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.desperate,
  speaker: names.you,
  text: () => [
    "Why would you want a historical ethnographer for this? Aren't there like... mercenaries you can hire?",
    "Call the time police! Not me!",
    "I'm not cut out for this. The most important thing I've ever done is... Well I'm not entirely sure to be honest.",
    "I interviewed the person who invented milk? He was a bit of a weirdo.",
    "What kind of person looks at a cow and thinks 'yeah, let's squeeze that and drink whatever comes out'?"
  ],
  next: () => nodeStore.set(missionIntro11)
}

const missionIntro11: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.desperate,
  speaker: names.futureLady,
  text: () => [
    "But it WAS a very good interview."
  ],
  next: () => nodeStore.set(missionIntro12)
}

const missionIntro12: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.desperate,
  speaker: names.you,
  text: () => [
    "...I suppose I have to agree to this, don't I?",
    "It really doesn't feel like you're giving me much choice."
  ],
  next: () => nodeStore.set(missionIntro13)
}

const missionIntro13: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.desperate,
  speaker: names.futureLady,
  text: () => [
    "No. No I'm not.",
    "So, are you in?"
  ],
  next: () => nodeStore.set(introStart14)
}

const introStart14: GraphNode = {
  type: "OPTION",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.desperate,
  prompt: "Are you in?",
  options: [
    {
      text: "Yes...",
      next: () => nodeStore.set(missionIntro15)
    },
    {
      text: "Yesssss!",
      next: () => nodeStore.set(missionIntro15)
    },
    {
      text: "Hell yeah, let's go.",
      next: () => nodeStore.set(missionIntro15)
    }
  ],
}

const missionIntro15: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.officeWide,
  leftCharacterUrl: characters.futureLady.smile,
  speaker: names.futureLady,
  text: () => ["Good. Let's begin the briefing."],
  next: () => nodeStore.set(missionStart)
}
