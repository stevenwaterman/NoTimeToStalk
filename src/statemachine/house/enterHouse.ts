import { names } from "../../names";
import { characters } from "../characters";
import type { ExploreCharacters, GraphNode } from "../controller";
import { chapterStore, makeBackgrounds } from "../controller";
import { exploreStart } from "../explore/start";
import { nodeStore, userInputStore } from "../state";

const backgrounds = makeBackgrounds("enterHouse", [
  "doorOpens", // Admiral + goldie at the door, looking excited
  "dogInDoor", // Closeup of goldie in the doorway
  "atrium", // Wide shot of the atrium, can be the same one if you want
]);

const backstories = {
  dog: {
    1: ["Woof."]
  },
  host: {
    1: ["..."]
  },
  red: {
    1: [
      "I'm a scrap-worker by trade. I met the Admiral about 10 years ago when he came by and bought a ship from me.",
      "It was perfectly fine, I assure you, but Thomas thought otherwise. Took years of yelling to get it to a state he was happy with.",
      "I suppose he invited me here as an apology for being an awful customer."
    ],
    2: [
      "I was actually a stowaway on one of the ships the Admiral was in charge of. I recognised a Navy ship, hopped aboard and hoped for the best.",
      "They discovered me in the cargo bay and imprisoned me for a couple of weeks, but the Admiral really took a liking to me. At the next stop, I was let free.",
      "I guess me being here is a lover's reunion."
    ],
    3: [
      "Admiral Thomas and I were involved in some... erm... *sailing* a few years back.",
      "There was some... *valuables* we were both determined to... *find*, and we weren't willing to share. I lost some of my men, him some of his...",
      "We never found it in the end - or at least that's what he claims. He's only asked me to be here to convince me of that."
    ]
  },
  yellow: {
    1: [
      "It's possible that Admiral Thomas may be my father.",
      "My mother is an incredibly influential woman in the courts, and some decades ago there was some... business between her and the Admiral that lasted a few months.",
      "It seems that the Admiral is spending his retirement settling his affairs with many people from his past, including my mother, to seek an heir to his estate. So, here I am, maybe meeting my dad."
    ],
    2: [
      "Well... the Admiral and I have a long and hard history. A few years ago I met darling Thomas - without divulging the details, we had the most sensational time.",
      "Ever since, we've been exchanging *very* private notes with each other.",
      "My invite tonight will be the culmination of our adventures - the climax, if you will."
    ],
    3: [
      "I'm the Admiral's clothier. All those beautiful outfits you catch him in? Because of me.",
      "He gives me a brief, I deliver the goods! Sometimes it can take a little while with his very *specific* tastes, but we get there in the end.",
      "He invited me tonight to see him in action in his brand new suit! Isn't it a beauty..."
    ]
  },
  pink: {
    1: [
      "I was an escort working around one of the docks the Navy visited occasionally.",
      "The Admiral took a liking to me and would make detours whenever possible to come visit. On his most recent visit a few months ago, he brought me back with him - said I deserved better for myself.",
      "He was never shy about me when we were together, but I certainly didn't expect an invite here."
    ],
    2: [
      "I grew up on the other side of the world without much of a family or home to live in.",
      "The Admiral found me on the street begging one day, took me in, and fed me a good meal. After talking for a while and getting to know me, he took me under his wing and started mentoring me.",
      "He insisted I came tonight, apparently 'any apprentice of mine MUST know how to entertain!'"
    ],
    3: [
      "I worked as a housemaid for Mr. Thomas many years ago, before his disappearance.",
      "One day when I turned up for work, he had left a note on his door that he no longer required my services. Alongside it was a small package full of money - enough to survive on until I found a new job.",
      "We never spoke after that day. I'm hoping that tonight I can finally learn what went on all those years ago."
    ]
  },
  green: {
    1: [
      "I worked very closely with Admiral Thomas in the Navy. I was the Surgeon Vice Admiral to his fleet, so we'd often be at sea together for many months at a time.",
      "We'd generally get along, but he'd make my job far harder than necessary when he'd get into one of his famous fistfights.",
      "Perhaps he invited me to apologise for that, but I doubt it."
    ],
    2: [
      "Thomas and I rarely see eye to eye. I am a huge proponent for the use of aeroplanes in warfare and combat - we are much safer in the sky!",
      "Thomas, on the other hand, would defend the utility of ships til the end, and quickly jump to their defence.",
      "It wouldn't surprise me if he invited me tonight simply to entertain the other guests when we inevitably start arguing again!"
    ],
    3: [
      "I first met Mr. Thomas when he was a young boy, not far over 18, I'd say.",
      "He was interested in joining the Navy, but was in no shape to do so! With my help, he trained both physically and mentally to be fit for the job.",
      "He made it in, albeit barely, and from there he reached heights I could never have imagined! It's nice to see him again, after all these years."
    ]
  },
  blue: {
    1: [
      "While I know a lot about him, Mr. Thomas knows very little about myself, and I'd like to keep it that way.",
      "We haven't really seen eye to eye since I reported on his recent adventures in piracy. To see a once-great man resort to such lows saddened me, but the public deserved to know.",
      "I didn't want to be here tonight, but I need to confront him in person."
    ],
    2: [
      "I worked with the Admiral when he moved into this house and helped him turn it into a home!",
      "I spent months talking to manufacturers and designers across the world, but I've never had the opportunity to come and see it for myself until he invited me to tonight.",
      "I'm honoured that he's finally letting me the fruits of our labour - what I've seen so far is stunning!"
    ],
    3: [
      "I'm Cassandra's cousin. You know, his 'wife'? That's what he wants you to think!",
      "She barely knows the guy - they met *three whole times*. Ever. It's gone way too far, and poor Cassie can't take this web of lies anymore.",
      "He invited her to this party, but I'm here instead to tell him to cut it out and leave her alone."
    ]
  },
  black: {
    1: [
      "I was an engineer on one of the Admiral's ships a couple of years ago.",
      "He seemed to pick on me, calling me into his office to fix menial problems while the others could enjoy their leisure time alone.",
      "After we docked, I didn't really have a place to go, but the Admiral let me stay with him and... took care of me. We're now very good friends."
    ],
    2: [
      "I met the Admiral when he was in the Navy, back when I was just a boy. My parents were criminals at sea, dragging me along with them.",
      "One day, my parents messed up their plans, and we ended up captured by the fleet. I don't remember much of it, other than my family's face when the ship's crew separated us.",
      "One of the crewmen adopted me, and while I love my dad, I'm hoping the Admiral has information on my birth parents."
    ],
    3: [
      "I'm surprised you don't recognise me - I'm the most successful lawyer in the country!",
      "When the Admiral was dealing with those slanderous claims of piracy, he contracted me to clear his name.",
      "My hard work in winning that case is the reason this dinner party can happen, so of course I was invited."
    ]
  }
}

export const enterHouse: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.doorOpens,
  sounds: [{filePath: "effects/enterHouse/door"}],
  text: () => [
    "Before you get a chance to ring the bell, the door swings open revealing a flamboyantly dressed man and a conservatively dressed dog, setting you at ease immediately."
  ],
  next: () => nodeStore.set(admiralThomasIntro)
}

const admiralThomasIntro: GraphNode = {
  type: "INTRO",
  character: "host",
  onEnter: () => chapterStore.set("enterHouse"),
  next: () => nodeStore.set(enterHouse2)
}

const enterHouse2: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.doorOpens,
  speaker: names.host,
  text: state => [
    `Ahh, it's so wonderful to see you ${names[state.character]}. I hope your journey was delightful.`,
    "Yes, please do come in! The others are already here."
  ],
  next: () => nodeStore.set(enterHouse3)
}

const enterHouse3: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.dogInDoor,
  speaker: names.host,
  text: () => [
    "I heard that Goldie's introduced himself already! What a naughty boy."
  ],
  next: () => nodeStore.set(goldieIntro)
}

const goldieIntro: GraphNode = {
  type: "INTRO",
  character: "dog",
  next: () => nodeStore.set(enterHouse4)
}

const enterHouse4: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.host.happy,
  speaker: names.host,
  text: () => [
    "Ah, what an absolute pleasure to have you all here! Pleaaase feel free to mingle and get to know each other, yes!"
  ],
  next: () => nodeStore.set(mingleStart)
}

const mingleStart: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  text: () => [
    "You begin to work your way around the guests, getting to know each of them."
  ],
  next: state => state.character === "red" ? nodeStore.set(mingleYellow) : nodeStore.set(mingleRed)
}

function createMingleSelf(leftCharacterUrl: string): GraphNode {
  return {
    type: "OPTION",
    backgroundUrl: backgrounds.atrium,
    leftCharacterUrl,
    prompt: "How do you know the Admiral?",
    options: [
      {
        visible: state => state.character === "host",
        text: "I am the admiral",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 1)),
      },
    {
        visible: state => state.character === "dog",
        text: "Woof",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 1)),
      },
    {
        visible: state => state.character === "red",
        text: "Sold him a pirate ship",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 1)),
      },
    {
        visible: state => state.character === "red",
        text: "Stowaway on his Navy ship",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 2)),
      },
    {
        visible: state => state.character === "red",
        text: "His rival pirate",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 3)),
      },
    {
        visible: state => state.character === "yellow",
        text: "His illegitimate child",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 1)),
      },
    {
        visible: state => state.character === "yellow",
        text: "His naughty penpal",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 2)),
      },
    {
        visible: state => state.character === "yellow",
        text: "His fashion designer",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 3)),
      },
    {
        visible: state => state.character === "pink",
        text: "His favourite escort",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 1)),
      },
    {
        visible: state => state.character === "pink",
        text: "His apprentice",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 2)),
      },
    {
        visible: state => state.character === "pink",
        text: "His maid many years ago",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 3)),
      },
    {
        visible: state => state.character === "green",
        text: "His Navy colleague",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 1)),
      },
    {
        visible: state => state.character === "green",
        text: "Plane advocate",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 2)),
      },
    {
        visible: state => state.character === "green",
        text: "His mentor",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 3)),
      },
    {
        visible: state => state.character === "blue",
        text: "Wrote about him as a journalist",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 1)),
      },
    {
        visible: state => state.character === "blue",
        text: "His interior designer",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 2)),
      },
    {
        visible: state => state.character === "blue",
        text: "His wife's cousin",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 3)),
      },
    {
        visible: state => state.character === "black",
        text: "His ship engineer",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 1)),
      },
    {
        visible: state => state.character === "black",
        text: "His prisoner",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 2)),
      },
    {
        visible: state => state.character === "black",
        text: "His lawyer",
        next: state => nodeStore.set(createBackstoryNode(state.character, leftCharacterUrl, 3)),
      }, 
    ]
  }
}


function createBackstoryNode(character: ExploreCharacters, leftCharacterUrl: string, story: 1 | 2 | 3): GraphNode {
  return {
    type: "MONOLOGUE",
    speaker: names.you,
    backgroundUrl: backgrounds.atrium,
    leftCharacterUrl,
    onEnter: () => { userInputStore.update(state => ({...state, backstory: story })) },
    text: () => backstories[character][story],
    next: () => character === "red" || character === "yellow" ? nodeStore.set(minglePink) : nodeStore.set(mingleYellow)
  }
}


const mingleRed: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.red.smile,
  speaker: "???",
  text: () => [
    `Hi, my name is ${names.red}.`,
  ],
  next: () => nodeStore.set(mingleRedIntro)
}

const mingleRedIntro: GraphNode = {
  type: "INTRO",
  character: "red",
  next: () => nodeStore.set(mingleRedMain)
}

const mingleRedMain: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.red.smile,
  speaker: names.red,
  text: state => [
    ...backstories.red[state.backstories.red || 1],
    "What about you?"
  ],
  next: () => nodeStore.set(createMingleSelf(characters.red.smile))
}


const mingleYellow: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.yellow.smile,
  speaker: "???",
  text: () => [
    `Hi, my name is ${names.yellow}.`,
  ],
  next: () => nodeStore.set(mingleYellowIntro)
}

const mingleYellowIntro: GraphNode = {
  type: "INTRO",
  character: "yellow",
  next: () => nodeStore.set(mingleYellowMain)
}

const mingleYellowMain: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.yellow.smile,
  speaker: names.yellow,
  text: state => [
    ...backstories.yellow[state.backstories.yellow || 1],
    "What about you?"
  ],
  next: state => state.character === "red" ? nodeStore.set(createMingleSelf(characters.yellow.smile)) : nodeStore.set(mingleYellowIntroduceSelf)
}

const mingleYellowIntroduceSelf: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.yellow.smile,
  text: () => ["You explain your backstory."],
  next: state => state.character === "pink" ? nodeStore.set(mingleGreen) : nodeStore.set(minglePink)
}


const minglePink: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.pink.smile,
  speaker: "???",
  text: () => [
    `Hi, my name is ${names.pink}.`,
  ],
  next: () => nodeStore.set(minglePinkIntro)
}

const minglePinkIntro: GraphNode = {
  type: "INTRO",
  character: "pink",
  next: () => nodeStore.set(minglePinkMain)
}

const minglePinkMain: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.pink.smile,
  speaker: names.pink,
  text: state => [
    ...backstories.pink[state.backstories.pink || 1],
    "What about you?"
  ],
  next: () => nodeStore.set(minglePinkIntroduceSelf)
}

const minglePinkIntroduceSelf: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.pink.smile,
  text: () => ["You explain your backstory."],
  next: state => state.character === "green" ? nodeStore.set(mingleBlue) : nodeStore.set(mingleGreen)
}


const mingleGreen: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.green.smile,
  speaker: "???",
  text: () => [
    `Hi, my name is ${names.green}.`,
  ],
  next: () => nodeStore.set(mingleGreenIntro)
}

const mingleGreenIntro: GraphNode = {
  type: "INTRO",
  character: "green",
  next: () => nodeStore.set(mingleGreenMain)
}

const mingleGreenMain: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.green.smile,
  speaker: names.green,
  text: state => [
    ...backstories.green[state.backstories.green || 1],
    "What about you?"
  ],
  next: () => nodeStore.set(mingleGreenIntroduceSelf)
}

const mingleGreenIntroduceSelf: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.green.smile,
  text: () => ["You explain your backstory."],
  next: state => state.character === "blue" ? nodeStore.set(mingleBlack) : nodeStore.set(mingleBlue)
}


const mingleBlue: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.blue.smile,
  speaker: "???",
  text: () => [
    `Hi, my name is ${names.blue}.`,
  ],
  next: () => nodeStore.set(mingleBlueIntro)
}

const mingleBlueIntro: GraphNode = {
  type: "INTRO",
  character: "blue",
  next: () => nodeStore.set(mingleBlueMain)
}

const mingleBlueMain: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.blue.smile,
  speaker: names.blue,
  text: state => [
    ...backstories.blue[state.backstories.blue || 1],
    "What about you?"
  ],
  next: () => nodeStore.set(mingleBlueIntroduceSelf)
}

const mingleBlueIntroduceSelf: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.blue.smile,
  text: () => ["You explain your backstory."],
  next: state => state.character === "black" ? nodeStore.set(mingleDone) : nodeStore.set(mingleBlack)
}


const mingleBlack: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.black.smile,
  speaker: "???",
  text: () => [
    `Hi, my name is ${names.black}.`,
  ],
  next: () => nodeStore.set(mingleBlackIntro)
}

const mingleBlackIntro: GraphNode = {
  type: "INTRO",
  character: "black",
  next: () => nodeStore.set(mingleBlackMain)
}

const mingleBlackMain: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.black.smile,
  speaker: names.black,
  text: state => [
    ...backstories.black[state.backstories.black || 1],
    "What about you?"
  ],
  next: () => nodeStore.set(mingleBlackIntroduceSelf)
}

const mingleBlackIntroduceSelf: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.black.smile,
  text: () => ["You explain your backstory."],
  next: () => nodeStore.set(mingleDone)
}


const mingleDone: GraphNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.atrium,
  leftCharacterUrl: characters.host.happy,
  speaker: names.host,
  text: () => [
    "Ohh yes, I'm SO glad to see you've all gotten to know each other a little better.",
    "I regret deeply to inform you of this, but dinner won't be ready for another half an hour or so, yes.",
    "Please, make yourselves comfortable and feel free to explore this BEAUTIFUL home of mine and Goldie's!"
  ],
  next: () => nodeStore.set(exploreStart)
}