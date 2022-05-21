import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { balconyStart } from "./balcony";
import { hasBuff, isHostHere } from "./explore";
import { getGlobalOptions } from "./global";
import { landingStart } from "./landing";
import { secretPassageStartUpper } from "./secretPassage";
import { nodeStore, updateState } from "../state";

export type MasterBedroomFlags = {
  lookAround: boolean;
  underBed: boolean;
  inWardrobe: boolean;
  takenMoney: boolean;
  bedsideTables: boolean;
  art: boolean;
  mirror: boolean;
};

const backgrounds = makeBackgrounds("masterBedroom", [
  "wide",
  "wide1",
  "wide2",
  "wide3",
  "underBed",
  "money",
  "vanity",
  "wardrobe",
  "bed",
  "bedsideTables",
  "chair",
  "art",
  "mirror"
])

export const masterBedroomStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "entering the master bedroom.", location: "masterBedroom" }),
  backgroundUrl: backgrounds.wide,
  text: () => ["You are in the master bedroom."],
  next: () => nodeStore.set(masterBedroomOptions)
}

export const masterBedroomSecretStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "climbing out of the wardrobe.", location: "masterBedroom", suspicious: true, roomFlags: { masterBedroom: { inWardrobe: true }}}),
  backgroundUrl: backgrounds.wardrobe,
  text: () => ["You enter the master bedroom via a hidden back in the wardrobe."],
  next: () => nodeStore.set(masterBedroomOptions)
}

const masterBedroomOptions: OptionNode = {
  type: "OPTION",
  onEnter: updateState({ action: "not doing much." }),
  prompt: "What do you want to do?",
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.masterBedroom.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround1)
    },
    {
      visible: state => state.explore.roomFlags.masterBedroom.lookAround && !state.explore.roomFlags.masterBedroom.art,
      text: "Admire the art",
      next: () => nodeStore.set(admireArt)
    },
    {
      visible: state => state.explore.roomFlags.masterBedroom.lookAround,
      text: "Have a sit down",
      next: () => nodeStore.set(sitDown)
    },
    {
      visible: state => state.explore.roomFlags.masterBedroom.lookAround && !state.explore.roomFlags.masterBedroom.underBed,
      text: "Look under the bed",
      next: () => nodeStore.set(underBed)
    },
    {
      visible: state => state.explore.roomFlags.masterBedroom.lookAround && !state.explore.roomFlags.masterBedroom.inWardrobe,
      text: "Look through the wardrobe",
      next: () => nodeStore.set(wardrobe)
    },
    {
      visible: state => state.explore.roomFlags.masterBedroom.lookAround && !state.explore.roomFlags.masterBedroom.mirror,
      text: "Look in the mirror",
      next: () => nodeStore.set(lookInMirror)
    },
    {
      visible: state => state.explore.roomFlags.masterBedroom.lookAround && !hasBuff(state, "pretty"),
      text: "Put on makeup",
      next: () => nodeStore.set(makePretty)
    },
    ...getGlobalOptions(() => masterBedroomOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.masterBedroom.lookAround && !state.explore.roomFlags.masterBedroom.bedsideTables,
      text: "Look in the bedside tables",
      next: () => nodeStore.set(bedsideTables),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.masterBedroom.lookAround && !state.explore.roomFlags.masterBedroom.takenMoney && state.explore.roomFlags.masterBedroom.underBed,
      text: "Steal the money",
      next: () => nodeStore.set(takeMoney),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.masterBedroom.lookAround,
      text: "Relax in the host's bed",
      next: () => nodeStore.set(relaxInBed),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.masterBedroom.inWardrobe,
      text: "Enter the secret passage",
      next: () => nodeStore.set(secretPassage),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go to the landing",
      next: () => nodeStore.set(landingStart)
    },
    {
      text: "Go out onto the balcony",
      next: () => nodeStore.set(balconyStart)
    },
  ]
}

const lookAround1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "having a look around.", roomFlags: { masterBedroom: { lookAround: true }} }),
  backgroundUrl: backgrounds.wide1,
  text: () => ["You have a look around the master bedroom. It's a very dim, yet relaxing room to sleep in."],
  next: () => nodeStore.set(lookAround2)
}

const lookAround2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide2,
  text: () => ["The wardrobes and dressing areas are separated from the sleeping areas with a shorter wall. You're sure it was quite revolutionary architecture at the time."],
  next: () => nodeStore.set(lookAround3)
}

const lookAround3: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide3,
  text: () => ["You see there's plenty of space for all of the host's belongings in this area. It's very different to the Cloud Wardrobe that you're used to."],
  next: () => nodeStore.set(masterBedroomOptions)
}

const underBed: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking under the bed.", suspicious: true, roomFlags: { masterBedroom: { underBed: true }}}),
  backgroundUrl: backgrounds.underBed,
  text: () => ["As you peek under the bed, you find a briefcase peeking out. It contains a small pile of money."],
  next: () => nodeStore.set(masterBedroomOptions)
}

const takeMoney: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking something from under the bed.", suspicious: true, roomFlags: { masterBedroom: { takenMoney: true }}}),
  backgroundUrl: backgrounds.money,
  text: () => ["You're a sucker for old currency. You take some of the money discretely."],
  next: () => nodeStore.set(masterBedroomOptions)
}

const makePretty: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "putting on some makeup.", suspicious: true, buffs: { pretty: true }}),
  backgroundUrl: backgrounds.vanity,
  text: () => ["You sit down at the dressing table ready to get to work. With precision and care, you apply the Admiral's makeup to your face. You feel all pretty."],
  next: () => nodeStore.set(masterBedroomOptions)
}

const wardrobe: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking through the wardrobe.", suspicious: true, roomFlags: { masterBedroom: { inWardrobe: true }}}),
  backgroundUrl: backgrounds.wardrobe,
  text: () => ["You look through the wardrobe. So. Much. Colour.",
  "After moving one of the Admiral's dinner jackets to the side, you discover the wardrobe has a missing back, leading to a secret passage."],
  next: () => nodeStore.set(masterBedroomOptions)
}

const relaxInBed: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "lying on the bed.", suspicious: true }),
  backgroundUrl: backgrounds.bed,
  sounds: [{ filePath: "effects/explore/masterBedroom/snoring", delay: 1 }],
  text: () => ["You lie down on the bed. It's incredibly comfortable. You feel refreshed already."],
  next: () => nodeStore.set(masterBedroomOptions)
}

const sitDown: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "sitting in the chair." }),
  backgroundUrl: backgrounds.chair,
  sounds: [{filePath: "effects/explore/atrium/sit", volume: 0.4}],
  text: () => ["You have a sit down on the chair in the corner. The upholstery digs in a little, but you enjoy resting your feet."],
  next: () => nodeStore.set(masterBedroomOptions)
}

const lookInMirror: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking in the mirror.", roomFlags: { masterBedroom: { mirror: true }}}),
  backgroundUrl: backgrounds.mirror,
  text: () => ["You look in the mirror. You think of all the times the Admiral must have looked at himself and deliberated on his outfit. You hope yours is good enough for his tastes."],
  next: () => nodeStore.set(masterBedroomOptions)
}

const admireArt: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the art.", roomFlags: { masterBedroom: { art: true }}}),
  backgroundUrl: backgrounds.art,
  text: () => ["You admire the portraits on the wall. You think it's weird to have faces staring at you while you sleep, but at least they look friendly."],
  next: () => nodeStore.set(masterBedroomOptions)
}

const secretPassage: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "climbing inside the wardrobe.", suspicious: true }),
  backgroundUrl: backgrounds.wardrobe,
  text: () => ["You climb inside the wardrobe, and venture into the secret passage."],
  next: () => nodeStore.set(secretPassageStartUpper)
}

const bedsideTables: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking through the bedside tables.", suspicious: true, roomFlags: { masterBedroom: { bedsideTables: true }}}),
  backgroundUrl: backgrounds.bedsideTables,
  sounds: [{ filePath: "effects/explore/masterBedroom/drawer", volume: 0.4, delay: 0.5 }],
  text: () => ["You look through the bedside tables. There's a couple of books and random items, but nothing that feels particularly interesting."],
  next: () => nodeStore.set(masterBedroomOptions)
}
