import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { confirmWeapon, hasBuff, isDogHere, isHoldingWeapon, isHostHere } from "./explore";
import { getGlobalOptions } from "./global";
import { landingStart } from "./landing";
import { nodeStore, updateState } from "../state";

export type BathroomFlags = {
  lookAround: boolean;
  toiletRoll: boolean;
  cabinet: boolean;
  window: boolean;
};

const backgrounds = makeBackgrounds("bathroom", [
  "wide",
  "wide1",
  "wide2",
  "toiletRoll",
  "cabinet",
  "drugs",
  "washDog",
  "cleanClothes",
  "window",
  "mirror"
])

export const bathroomStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ location: "bathroom", action: "entering the room." }),
  backgroundUrl: backgrounds.wide,
  text: () => ["You are in the upstairs bathroom."],
  next: () => nodeStore.set(bathroomOptions)
}

const bathroomOptions: OptionNode = {
  type: "OPTION",
  prompt: "What do you want to do?",
  onEnter: updateState({ action: "not doing much." }),
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.bathroom.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround1)
    },
    {
      visible: state => state.explore.roomFlags.bathroom.lookAround,
      text: "Pull faces in the mirror",
      next: () => nodeStore.set(facesInMirror)
    },
    {
      visible: state => state.explore.roomFlags.bathroom.lookAround && !state.explore.roomFlags.bathroom.window,
      text: "Look out the window",
      next: () => nodeStore.set(lookOutWindow)
    },
    {
      visible: state => state.explore.roomFlags.bathroom.lookAround && isDogHere(state),
      text: "Wash the dog",
      next: () => nodeStore.set(washDog)
    },
    {
      visible: state => state.explore.roomFlags.bathroom.lookAround && hasBuff(state, "muddy") && !hasBuff(state, "painty"),
      text: "Clean off mud",
      next: () => nodeStore.set(washClothes)
    },
    {
      visible: state => state.explore.roomFlags.bathroom.lookAround && !hasBuff(state, "muddy") && hasBuff(state, "painty"),
      text: "Clean off paint",
      next: () => nodeStore.set(washClothes)
    },
    {
      visible: state => state.explore.roomFlags.bathroom.lookAround && hasBuff(state, "muddy") && hasBuff(state, "painty"),
      text: "Clean off mud and paint",
      next: () => nodeStore.set(washClothes)
    },
    ...getGlobalOptions(() => bathroomOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.bathroom.lookAround && !state.explore.roomFlags.bathroom.toiletRoll,
      text: "Flip the toilet roll",
      next: () => nodeStore.set(toiletRoll),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.bathroom.lookAround && !state.explore.roomFlags.bathroom.cabinet,
      text: "Look in the medicine cabinet",
      next: () => nodeStore.set(medicineCabinet),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.bathroom.lookAround && state.explore.roomFlags.bathroom.cabinet && !isHoldingWeapon(state, "drugs"),
      text: "Take drugs",
      next: state => confirmWeapon(state, bathroomOptions, takeDrugs),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go back to the landing",
      next: () => nodeStore.set(landingStart)
    },
  ]
}

const lookAround1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "having a look around.", roomFlags: { bathroom: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide1,
  text: () => ["To the right, you see an old bath and a metal tub. You assume this is where bodies and clothes are washed, but they're a lot more manual than the cleaning methods you're used to."],
  next: () => nodeStore.set(lookAround2)
}

const lookAround2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide2,
  text: () => ["Straight ahead, you see some cabinets with a sink and a toilet. You really hope that your bladder can hold out, because you have no idea how to use this toilet."],
  next: () => nodeStore.set(bathroomOptions)
}

const facesInMirror: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "pulling faces in the mirror." }),
  backgroundUrl: backgrounds.mirror,
  text: () => ["You pull faces in the mirror. You're looking pretty good today, by the way."],
  next: () => nodeStore.set(bathroomOptions)
}

const medicineCabinet: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking through the medicine cabinet", suspicious: true, roomFlags: { bathroom: { cabinet: true }}}),
  sounds: [{filePath: "effects/explore/bathroom/cabinet"}],
  backgroundUrl: backgrounds.cabinet,
  text: () => ["You look through the medicine cabinets. There's all sorts of 'medicine' in here - cocaine, heroin, morphine..."],
  next: () => nodeStore.set(bathroomOptions)
}

const takeDrugs: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking something out of the medicine cabinet.", suspicious: true, weapon: "drugs" }),
  sounds: [{filePath: "explore/dining/pickup"}],
  backgroundUrl: backgrounds.drugs,
  text: () => ["You take the drugs.", "...and put them in your pocket. What did you think this meant?"],
  next: () => nodeStore.set(bathroomOptions)
}

const washDog: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "washing the dog.", suspicious: true, buffs: { wet: true }}),
  backgroundUrl: backgrounds.washDog,
  sounds: [{ filePath: "effects/explore/bathroom/washDog", delay: 0.5 }],
  text: () => [
    "You lift Goldie into the bathtub and give him a little wash. While you enjoy the process, he looks completely betrayed.", 
    "Goldie will remember this.", 
    "You get wet in the process."
  ],
  next: () => nodeStore.set(bathroomOptions)
}

const washClothes: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "nude, washing their clothes.", suspicious: true, buffs: { wet: true, muddy: false, painty: false }}),
  backgroundUrl: backgrounds.cleanClothes,
  sounds: [{ filePath: "effects/explore/bathroom/washClothes", delay: 0.5 }],
  text: () => [
    "You strip off completely and wash your clothes in the tub.", 
    "You get them lovely and clean, but have to put soggy clothes back on... ew."
  ],
  next: () => nodeStore.set(bathroomOptions)
}

const toiletRoll: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "doing something to the toilet roll.", suspicious: true, roomFlags: { bathroom: { toiletRoll: true }}}),
  backgroundUrl: backgrounds.toiletRoll,
  text: () => [
    "You pick up the toilet roll and turn it around, putting it back the correct way.", 
    "What kind of monster would leave their toilet roll like that?"
  ],
  next: () => nodeStore.set(bathroomOptions)
}

const lookOutWindow: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking out the window.", roomFlags: { bathroom: { window: true }}}),
  backgroundUrl: backgrounds.window,
  text: () => [
    "You look out of the window into the garden.", 
    "You stare as hard as you can, but unfortunately the glass is frosted, so you can't see anything."
  ],
  next: () => nodeStore.set(bathroomOptions)
}
