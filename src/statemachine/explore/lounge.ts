import { GameState, makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { atriumStart } from "./atrium";
import { confirmWeapon, gardenCharacters, hasBuff, isHoldingWeapon, isHostHere } from "./explore";
import { getGlobalOptions } from "./global";
import { secretPassageStartLower } from "./secretPassage";
import { nodeStore, updateState } from "../state";

export type LoungeFlags = {
  lookAround: boolean;
  medicine: boolean;
  bookcase: boolean;
  fish: boolean;
  art: boolean;
};

const backgrounds = makeBackgrounds("lounge", [
  "wide",
  "wide1",
  "wide2",
  "fire",
  "cabinet",
  "bandage",
  "poison",
  "window",
  "bookcase",
  "secretPassage",
  "fish",
  "art1",
  "art2",
  "art3",
])

export const loungeStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "entering the lounge.", location: "lounge" }),
  backgroundUrl: backgrounds.wide,
  text: () => ["You are in the lounge."],
  next: () => nodeStore.set(loungeOptions)
}

export const loungeSecretStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "entering the lounge through a secret bookcase door.", location: "lounge" }),
  backgroundUrl: backgrounds.wide,
  sounds: [{ filePath: "effects/explore/lounge/secretPassage" }],
  text: () => ["You enter the lounge via a secret entrance hidden in the bookcase."],
  next: () => nodeStore.set(loungeOptions)
}

const loungeOptions: OptionNode = {
  type: "OPTION",
  onEnter: updateState({ action: "not doing much." }),
  prompt: "What do you want to do?",
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.lounge.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround1)
    },
    {
      visible: state => state.explore.roomFlags.lounge.lookAround,
      text: "Sit and watch the fire",
      next: () => nodeStore.set(sitAtFire)
    },
    {
      visible: state => state.explore.roomFlags.lounge.lookAround && !state.explore.roomFlags.lounge.art,
      text: "Admire the art",
      next: () => nodeStore.set(lookAtArt1)
    },
    {
      visible: state => state.explore.roomFlags.lounge.lookAround && !state.explore.roomFlags.lounge.fish,
      text: "Look at the fish",
      next: () => nodeStore.set(lookAtFish)
    },
    {
      visible: state => state.explore.roomFlags.lounge.lookAround,
      text: "Look out the window",
      next: () => nodeStore.set(lookOutWindow)
    },
    {
      visible: state => state.explore.roomFlags.lounge.lookAround && !state.explore.roomFlags.lounge.bookcase,
      text: "Admire the bookcase",
      next: () => nodeStore.set(admireBookcase)
    },
    {
      visible: state => state.explore.roomFlags.lounge.lookAround && !state.explore.roomFlags.lounge.medicine,
      text: "Admire cabinet",
      next: () => nodeStore.set(admireCabinet)
    },
    {
      visible: state => state.explore.roomFlags.lounge.lookAround && state.explore.roomFlags.lounge.medicine && hasBuff(state, "injured"),
      text: "Bandage your wounds",
      next: () => nodeStore.set(bandageWounds)
    },
    ...getGlobalOptions(() => loungeOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.lounge.lookAround && state.explore.roomFlags.lounge.medicine && !isHoldingWeapon(state, "poison"),
      text: "Pick up some poison",
      next: state => confirmWeapon(state, loungeOptions, pickUpPoison),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.lounge.lookAround && state.explore.roomFlags.lounge.bookcase,
      text: "Pull on the weird looking book",
      next: () => nodeStore.set(secretDoor),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go into the atrium",
      next: () => nodeStore.set(atriumStart)
    },
  ]
}

const lookAround1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "not doing much.", roomFlags: { lounge: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide1,
  text: () => ["You have a look around this comforting lounge room. Its plush carpet and soft furnishings makes you feel like you're in the captain's quarters of a boat."],
  next: () => nodeStore.set(lookAround2)
}

const lookAround2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide2,
  text: () => ["This is a room that prioritises comfort, a leisurely read by the fire, and reminiscing on good times gone by. Sad that the host won't be able to experience this beyond tonight."],
  next: () => nodeStore.set(loungeOptions)
}

function sitAtFireText(state: GameState): string[] {
  if (hasBuff(state, "wet")) return ["You are no longer wet."]
  return [];
}

const sitAtFire: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "sitting in front of the fire.", buffs: { wet: false }}),
  backgroundUrl: backgrounds.fire,
  sounds: [{ filePath: "effects/explore/lounge/fire" },
    {filePath: "effects/explore/atrium/sit", volume: 0.4}],
  text: state => ["You sit at the fire. The heat warms up your body, and the crackling of the fire warms up your soul. It is hot, after all.", ...sitAtFireText(state)],
  next: () => nodeStore.set(loungeOptions)
}

const lookAtFish: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "staring at the fish, looking upset.", roomFlags: { lounge: { fish: true }}}),
  backgroundUrl: backgrounds.fish,
  sounds: [{ filePath: "effects/explore/lounge/fish", volume: 0.5 }],
  text: () => [
    "You watch the fish on the mantlepiece. It's not a pretty sight. This is a very inhumane way to keep a fish.", 
    "You have to remember that this is before the Animal Rights Riots of 2161. You sigh, but take a mental note for your research.",
  ],
  next: () => nodeStore.set(loungeOptions)
}

const lookAtArt1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the art.", roomFlags: { lounge: { art: true }}}),
  backgroundUrl: backgrounds.art1,
  text: () => ["You admire the art around the room. Above the fireplace is a beautiful painting - a tumultous scene at sea that the Admiral probably experienced many times. You imagine yourself on a boat of your own, sailing the seas with a crew."],
  next: () => nodeStore.set(lookAtArt2)
}

const lookAtArt2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.art2,
  text: () => ["On another wall are three portraits. You imagine them as the crew on your ship, slashing pirates and drinking merrily. But, it could be the Admiral's crew. Or even his family."],
  next: () => nodeStore.set(lookAtArt3)
}

const lookAtArt3: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.art3,
  text: () => ["You also notice a small bust in the corner of the room. The fact it's not smashed on the ground from the impact of the waves reminds you're not actually on a boat. Time travel has that immersive effect sometimes."],
  next: () => nodeStore.set(loungeOptions)
}

const lookOutWindow: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking out the window." }),
  backgroundUrl: backgrounds.window,
  text: state => ["You look out of the window into the garden.", ...gardenCharacters(state)],
  next: () => nodeStore.set(loungeOptions)
}

const admireBookcase: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the bookcase.", roomFlags: { lounge: { bookcase: true }}}),
  backgroundUrl: backgrounds.bookcase,
  text: () => ["You admire the bookcase. Fiction and non-fiction books galore! You deliberate taking 'Arts of the Seas' with you to read, but remember the rules of preserving history.","On a second glance, you notice that one book looks a little different to the others."],
  next: () => nodeStore.set(loungeOptions)
}

const admireCabinet: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the cabinet.", roomFlags: { lounge: { medicine: true }}}),
  backgroundUrl: backgrounds.cabinet,
  text: () => ["You admire the cabinet. It's full of old medicines which you recognise as deadly poison - interesting. There are also some bandages, which are the only thing you'd actually consider using."],
  next: () => nodeStore.set(loungeOptions)
}

const bandageWounds: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "dressing their wounds with some bandages.", suspicious: true, buffs: { injured: false }}),
  backgroundUrl: backgrounds.bandage,
  sounds: [{ filePath: "effects/explore/lounge/bandage" }],
  text: () => ["You use the bandages to care for your wounds.", "You are no longer injured."],
  next: () => nodeStore.set(loungeOptions)
}

const pickUpPoison: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking something out of the cabinet.", suspicious: true, weapon: "poison" }),
  backgroundUrl: backgrounds.poison,
  sounds: [{filePath: "explore/dining/pickup"}],
  text: () => ["You take some 'medicine' out of the cabinet. Arsenic.", "You hide it inside your jacket."],
  next: () => nodeStore.set(loungeOptions)
}

const secretDoor: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "fiddling with the bookshelf, which opens into a secret passageway, closing behind them as they go through.", suspicious: true }),
  backgroundUrl: backgrounds.secretPassage,
  sounds: [{ filePath: "effects/explore/lounge/secretPassage" }],
  text: () => ["You pull on the one suspicious book. It tilts forwards, and the bookshelf rotates, opening into a secret passage. Is this real?!"],
  next: () => nodeStore.set(secretPassageStartLower)
}