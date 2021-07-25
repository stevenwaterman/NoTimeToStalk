import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { diningStart } from "./dining";
import { confirmWeapon, isHoldingWeapon, isHostHere } from "./explore";
import { gardenStartAtrium } from "./garden";
import { getGlobalOptions } from "./global";
import { kitchenStart } from "./kitchen";
import { landingStart } from "./landing";
import { loungeStart } from "./lounge";
import { porchStart } from "./porch";
import { nodeStore, updateState } from "../state";
import { studyStart } from "./study";

export type AtriumFlags = {
  lookAround: boolean;
  feelFlame: boolean;
  underRug: boolean;
  sideboard: boolean;
  art: boolean;
};

const backgrounds = makeBackgrounds("atrium", [
  "wide",
  "wide1",
  "wide2",
  "wide3",
  "umbrella",
  "rug",
  "chair",
  "piano",
  "candle",
  "sideboard",
  "art1",
  "art2"
])

export const atriumStart: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide,
  onEnter: updateState({ action: "entering the room.", location: "atrium" }),
  text: () => [ "You are in the atrium." ],
  next: () => nodeStore.set(atriumOptions)
}

const atriumOptions: OptionNode = {
  type: "OPTION",
  prompt: "What do you want to do?",
  onEnter: updateState({ action: "not doing much." }),
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.atrium.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround1)
    },
    {
      visible: state => state.explore.roomFlags.atrium.lookAround && !state.explore.roomFlags.atrium.art,
      text: "Admire the art",
      next: () => nodeStore.set(admireArt1)
    },
    {
      visible: state => state.explore.roomFlags.atrium.lookAround,
      text: "Have a sit down",
      next: () => nodeStore.set(sitDown)
    },
    {
      visible: state => state.explore.roomFlags.atrium.lookAround,
      text: "Play the piano",
      next: () => nodeStore.set(playPiano)
    },
    {
      visible: state => state.explore.roomFlags.atrium.lookAround && !isHoldingWeapon(state, "umbrella"),
      text: "Take an umbrella",
      next: state => confirmWeapon(state, atriumOptions, takeUmbrella)
    },
    {
      visible: state => state.explore.roomFlags.atrium.lookAround && !state.explore.roomFlags.atrium.sideboard,
      text: "Inspect the sideboard",
      next: () => nodeStore.set(searchSideboard)
    },
    {
      visible: state => state.explore.roomFlags.atrium.lookAround && !state.explore.roomFlags.atrium.feelFlame,
      text: "Feel the candle",
      next: () => nodeStore.set(feelCandle)
    },
    ...getGlobalOptions(() => atriumOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.atrium.lookAround && !state.explore.roomFlags.atrium.underRug,
      text: "Look under the rug",
      next: () => nodeStore.set(underRug),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.atrium.lookAround && state.explore.roomFlags.atrium.sideboard && !isHoldingWeapon(state, "letterOpener"),
      text: "Take the letter opener",
      next: state => confirmWeapon(state, atriumOptions, letterOpener),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Leave the atrium",
      next: () => nodeStore.set(leaveAtrium)
    },
  ]
}

const lookAround1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "having a look around", roomFlags: { atrium: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide1,
  text: () => ["You immediately spot all the other guest's jackets and umbrellas left at the door. It's tense knowing that one of those coats belongs to a murderer."],
  next: () => nodeStore.set(lookAround2)
}

const lookAround2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide2,
  text: () => ["You get your first glimpse of the Admiral's decor choices. They're certainly... fitting of the time."],
  next: () => nodeStore.set(lookAround3)
}

const lookAround3: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide3,
  text: () => ["The atrium captures you as you glance towards the piano and the towering staircase behind it. Atriums became irrelevant after teleportation took over, and you feel slightly nostalgic for this past grandeur. But you're not here to just gawk at it."],
  next: () => nodeStore.set(atriumOptions)
}

const takeUmbrella: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking an umbrella.", weapon: "umbrella", suspicious: true }),
  sounds: [{filePath: "effects/explore/atrium/umbrella", delay: 1, volume: 0.5}],
  backgroundUrl: backgrounds.umbrella,
  text: () => ["After light deliberation of which colour to choose, you take an umbrella from the stand."],
  next: () => nodeStore.set(atriumOptions)
}

const admireArt1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the art", roomFlags: { atrium: { art: true }}}),
  backgroundUrl: backgrounds.art1,
  text: () => ["You admire the art between the doors. The spooky manor house vibes of the first painting feels eerie now you're in one yourself."],
  next: () => nodeStore.set(admireArt2)
}

const admireArt2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.art2,
  text: () => ["Across the atrium is another domineering painting. Perhaps this woman is Cassandra, his wife, or maybe another woman from a previous adventure."],
  next: () => nodeStore.set(atriumOptions)
}

const underRug: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking under the rug, for some reason.", suspicious: true, roomFlags: { atrium: { underRug: true }}}),
  backgroundUrl: backgrounds.rug,
  text: () => ["You look under the rug. There's nothing there. It's just a rug - though a pretty one, at least."],
  next: () => nodeStore.set(atriumOptions)
}

const sitDown: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "sitting down." }),
  backgroundUrl: backgrounds.chair,
  sounds: [{filePath: "effects/explore/atrium/sit", volume: 0.4}],
  text: () => ["You have a sit down on the chair. The seat is not as plush as it looks, but it's comfy enough."],
  next: () => nodeStore.set(atriumOptions)
}

const playPiano: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "playing the piano, badly."}),
  backgroundUrl: backgrounds.piano,
  sounds: [{ filePath: "effects/explore/atrium/piano", delay: 1 }],
  text: () => [
    "You play a jaunty tune on the piano. You put your heart and soul into every note played, tickling those ivories like no one ever has before! The tune echoes through the house, bringing joyous rhythm to all the guests!", 
    "...though it seems nobody is as impressed as you hoped."
  ],
  next: () => nodeStore.set(atriumOptions)
}

const feelCandle: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "deliberately burning themselves on the candle flame.", suspicious: true, roomFlags: { atrium: { feelFlame: true }}, buffs: { injured: true }}),
  backgroundUrl: backgrounds.candle,
  sounds: [{ filePath: "effects/explore/atrium/flame", delay: 1.5 }],
  text: () => [
    "You hold your hand into the flame. Unsurprisingly, it's pretty hot. You burn your hand. It hurts quite a lot.", 
    "You are visibly injured."
  ],
  next: () => nodeStore.set(atriumOptions)
}

const searchSideboard: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking through the drawers in the sideboard.", suspicious: true, roomFlags: { atrium: { sideboard: true }}}),
  backgroundUrl: backgrounds.sideboard,
  sounds: [{ filePath: "effects/explore/masterBedroom/drawer", volume: 0.4, delay: 1 }],
  text: () => [
    "You look at the sideboard. On the top is an interesting collection of artefacts. You remember hearing about the plant-cow phenomenon of the 1920s, but didn't expect them to look so menacing.",
    "You have a look through the drawers. You find a match, a thimble, some drawing pins and a concerningly large collection of letter openers."
  ],
  next: () => nodeStore.set(atriumOptions)
}

const letterOpener: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking something out of the drawers.", suspicious: true, weapon: "letterOpener" }),
  backgroundUrl: backgrounds.sideboard,
  text: () => ["You take one of the letter openers discretely. This will be helpful for all those letters you'll receive."],
  next: () => nodeStore.set(atriumOptions)
}

const leaveAtrium: OptionNode = {
  type: "OPTION",
  prompt: "Where do you want to go?",
  backgroundUrl: backgrounds.wide,
  options: [
    {
      text: "Kitchen",
      next: () => nodeStore.set(kitchenStart)
    },
    {
      text: "Dining Room",
      next: () => nodeStore.set(diningStart)
    },
    {
      text: "Porch via Front Door",
      next: () => nodeStore.set(porchStart)
    },
    {
       text: "Garden via Back Door",
       next: () => nodeStore.set(gardenStartAtrium)
    },
    {
      text: "Study",
      next: () => nodeStore.set(studyStart)
    },
    {
      text: "Lounge",
      next: () => nodeStore.set(loungeStart)
    },
    {
      text: "Upstairs",
      next: () => nodeStore.set(landingStart)
    },
    {
      text: "Cancel",
      next: () => nodeStore.set(atriumOptions)
    }
  ]
}