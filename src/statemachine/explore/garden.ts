import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { atriumStart } from "./atrium";
import { balconyCharacters, bathroomWindowCharacters, confirmWeapon, hasBuff, isHoldingWeapon, isHostHere, loungeWindowCharacters, studyWindowCharacters } from "./explore";
import { getGlobalOptions } from "./global";
import { porchStart } from "./porch";
import { nodeStore, updateState } from "../state";

export type GardenFlags = {
  lookAround: boolean;
  graves: boolean;
  fountain: boolean;
  vegetables: boolean;
};

const backgrounds = makeBackgrounds("garden", [
  "wide",
  "wide1",
  "wide2",
  "wide3",
  "grave1",
  "grave2",
  "fountain",
  "chair",
  "windows1",
  "windows2",
  "windows3",
  "tree",
  "treeTop",
  "spade",
  "vegetables"
])

export const gardenStartAtrium: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: state => {
    const wet = hasBuff(state, "wet") || !isHoldingWeapon(state, "umbrella");
    updateState({ location: "garden", action: "leaving the house through the back door.", buffs: { wet }})(state);
  },
  backgroundUrl: backgrounds.wide,
  text: state => [
    "You walk through the back door into the luscious rear garden of the manor house.",
    isHoldingWeapon(state, "umbrella") ? "It's raining, but your umbrella protects you." : "It's raining, and you're now wet."
  ],
  next: () => nodeStore.set(gardenOptions)
}

export const gardenStartPorch: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: state => {
    const wet = hasBuff(state, "wet") || !isHoldingWeapon(state, "umbrella");
    updateState({ location: "garden", action: "entering the garden from the porch.", buffs: { wet }})(state);
  },
  backgroundUrl: backgrounds.wide,
  text: state => [
    "You leave the porch to walk into the luscious rear garden of the manor house.",
    isHoldingWeapon(state, "umbrella") ? "It's raining, but your umbrella protects you." : "It's raining, and you're now wet."
  ],
  next: () => nodeStore.set(gardenOptions)
}

export const gardenStartIvy: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: state => {
    const wet = hasBuff(state, "wet") || !isHoldingWeapon(state, "umbrella");
    updateState({ location: "garden", action: "climbing down from the balcony into the garden.", suspicious: true, buffs: { wet }})(state);
  },
  backgroundUrl: backgrounds.wide,
  text: () => ["You find yourself in the luscious rear garden of the manor house."],
  next: () => nodeStore.set(gardenOptions)
}

export const gardenStartStudy: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: state => {
    const wet = hasBuff(state, "wet") || !isHoldingWeapon(state, "umbrella");
    updateState({ location: "garden", action: "climbing through the broken study window into the garden.", suspicious: true, buffs: { wet }})(state);
  },
  backgroundUrl: backgrounds.wide,
  text: state => [
    "You land in the luscious rear garden of the manor house.",
    isHoldingWeapon(state, "umbrella") ? "It's raining, but your umbrella protects you." : "It's raining, and you're now wet."
  ],
  next: () => nodeStore.set(gardenOptions)
}

const gardenOptions: OptionNode = {
  type: "OPTION",
  prompt: "What do you want to do?",
  backgroundUrl: backgrounds.wide1,
  options: [
    {
      visible: state => !state.explore.roomFlags.garden.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround)
    },
    {
      visible: state => state.explore.roomFlags.garden.lookAround && !state.explore.roomFlags.garden.fountain,
      text: "Inspect the fountain",
      next: () => nodeStore.set(inspectFountain)
    },
    {
      visible: state => state.explore.roomFlags.garden.lookAround,
      text: "Look through the windows",
      next: () => nodeStore.set(lookThroughWindows1)
    },
    {
      visible: state => state.explore.roomFlags.garden.lookAround && !state.explore.roomFlags.garden.vegetables,
      text: "Inspect the allotments",
      next: () => nodeStore.set(inspectAllotments)
    },
    {
      visible: state => state.explore.roomFlags.garden.lookAround && !state.explore.roomFlags.garden.graves,
      text: "Inspect the graves",
      next: () => nodeStore.set(inspectGraves1)
    },
    ...getGlobalOptions(() => gardenOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.garden.lookAround,
      text: "Climb a tree",
      next: () => nodeStore.set(climbTree)
    },
    {
      visible: state => state.explore.roomFlags.garden.lookAround && isHoldingWeapon(state, "spade"),
      text: "Pick up a spade",
      next: state => confirmWeapon(state, gardenOptions, takeSpade),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go into the Atrium",
      next: () => nodeStore.set(atriumStart)
    },
    {
      text: "Go into the Porch",
      next: () => nodeStore.set(porchStart)
    },
  ]
}

const lookAround: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "having a look around.", roomFlags: { garden: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide1,
  text: () => ["You have a look around the garden, taking in all of the sights and the smells of your damp surroundings."],
  next: () => nodeStore.set(lookAround2)
}

const lookAround2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide2,
  text: () => ["The candle-lit garden tries to give off comfy vibes, but you can't ignore the concerning number of graves under the tree."],
  next: () => nodeStore.set(lookAround3)
}

const lookAround3: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide3,
  text: () => ["You're sure it looks much more peaceful when it's not dark and rainy and on the night of a murder."],
  next: () => nodeStore.set(gardenOptions)
}

const inspectGraves1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "reading the graves.", suspicious: true, roomFlags: { garden: { graves: true }}}),
  backgroundUrl: backgrounds.grave1,
  text: () => ["You inspect the graves under the tree. They don't look very old, but already the names have started to fade away."],
  next: () => nodeStore.set(inspectGraves2)
}

const inspectGraves2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.grave2,
  text: () => ["There are fresh flowers left by the graves - the Admiral must care deeply for these people. You ponder their significance."], 
  next: () => nodeStore.set(gardenOptions) 
}

const climbTree: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "climbing the tree.", suspicious: true, buffs: { muddy: true } }),
  backgroundUrl: backgrounds.tree,
  sounds: [{ filePath: "effects/explore/garden/climbTree" }],
  text: () => ["You decide to climb up the tree. It's a little slippery and you get muddy in the process, but you manage to lean on one of the sturdier branches."],
  next: () => nodeStore.set(climbTreeTop)
}

const climbTreeTop: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "sitting at the top of the tree.", suspicious: true }),
  backgroundUrl: backgrounds.treeTop,
  text: state => ["From the top of the tree, you can see the balcony.", ...balconyCharacters(state)],
  next: () => nodeStore.set(gardenOptions)
}

const takeSpade: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "picking up a spade.", weapon: "spade", suspicious: true, buffs: { wet: true }}),
  sounds: [{filePath: "effects/explore/garden/spade"}],
  backgroundUrl: backgrounds.spade,
  text: () => [
    "After assessing all your options of optimal garden tool to acquire, you take a spade.",
    "The spade doesn't help protect you from the rain."
  ],
  next: () => nodeStore.set(gardenOptions)
}

const inspectFountain: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking in the fountain.", roomFlags: { garden: { fountain: true }}}),
  backgroundUrl: backgrounds.fountain,
  text: () => ["You take a look in the fountain. The water's a bit grimy from the leaves and dirt ending up in there, and you can barely hear it over the rain, but it looks adequately grand for this house."],
  next: () => nodeStore.set(gardenOptions)
}

const inspectAllotments: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking at the vegetables in the allotment.", roomFlags: { garden: { vegetables: true }}}),
  backgroundUrl: backgrounds.vegetables,
  text: () => [
    "You look into the allotments and see a large variety of vegetables growing.", 
    "It's the harvest festival soon - something you read about during your degree. Every year, in the autumn, people would collect their finest fruits and vegetables from that year's harvest. Then, they'd perform a ritual where they left a sacrifice to the green giant, to ensure the next year's harvest was bountiful.", 
    "You'd love to ask the Admiral more about the green giant."
  ],
  next: () => nodeStore.set(gardenOptions)
}

const lookThroughWindows1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking through the windows into the house." }),
  backgroundUrl: backgrounds.windows2,
  text: state => loungeWindowCharacters(state),
  next: () => nodeStore.set(lookThroughWindows2)
}

const lookThroughWindows2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.windows1,
  text: state => studyWindowCharacters(state),
  next: () => nodeStore.set(lookThroughWindows3)
}

const lookThroughWindows3: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.windows3,
  text: state => bathroomWindowCharacters(state),
  next: () => nodeStore.set(gardenOptions)
}
