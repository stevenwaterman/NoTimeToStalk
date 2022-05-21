import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { atriumStart } from "./atrium";
import { confirmWeapon, isHoldingWeapon, isHostHere } from "./explore";
import { gardenStartPorch } from "./garden";
import { getGlobalOptions } from "./global";
import { nodeStore, updateState } from "../state";

export type PorchFlags = {
  lookAround: boolean;
  smellFlowers: boolean;
  inspectBicycle: boolean;
  underBench: boolean;
};

const backgrounds = makeBackgrounds("porch", [
  "wide",
  "bicycle",
  "flowers",
  "bench",
  "underBench",
  "ratPoison"
])

export const porchStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "entering the porch.", location: "porch" }),
  backgroundUrl: backgrounds.wide,
  text: () => ["You are in the porch."],
  next: () => nodeStore.set(porchOptions)
}

const porchOptions: OptionNode = {
  type: "OPTION",
  onEnter: updateState({ action: "not doing much." }),
  prompt: "What do you want to do?",
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.porch.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround)
    },
    {
      visible: state => state.explore.roomFlags.porch.lookAround,
      text: "Sit on the bench",
      next: () => nodeStore.set(sitOnBench)
    },
    {
      visible: state => state.explore.roomFlags.porch.lookAround && !state.explore.roomFlags.porch.smellFlowers,
      text: "Smell the flowers",
      next: () => nodeStore.set(smellFlowers)
    },
    {
      visible: state => state.explore.roomFlags.porch.lookAround && !state.explore.roomFlags.porch.inspectBicycle,
      text: "Inspect the bicycle",
      next: () => nodeStore.set(inspectBicycle)
    },
    {
      visible: state => state.explore.roomFlags.porch.lookAround && !state.explore.roomFlags.porch.underBench,
      text: "Look under the bench",
      next: () => nodeStore.set(underBench)
    },
    ...getGlobalOptions(() => porchOptions,  backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.porch.lookAround && state.explore.roomFlags.porch.underBench && !isHoldingWeapon(state, "ratPoison"),
      text: "Take the rat poison",
      next: state => confirmWeapon(state, porchOptions, takePoison),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go into the atrium",
      next: () => nodeStore.set(atriumStart)
    },
    {
      text: "Go into the garden",
      next: () => nodeStore.set(gardenStartPorch)
    },
  ]
}

const lookAround: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "having a look around.", roomFlags: { porch: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide,
  text: () => ["You have a look around the porch. It makes the entryway very intimidating while also providing comfort from the elements."],
  next: () => nodeStore.set(porchOptions)
}

const sitOnBench: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "sitting on the bench." }),
  backgroundUrl: backgrounds.bench,
  text: () => ["You sit on the bench. It is not comfy at all, but provides a bit of rest for your feet."],
  next: () => nodeStore.set(porchOptions)
}

const smellFlowers: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "smelling the flowers." }),
  backgroundUrl: backgrounds.flowers,
  sounds: [{ filePath: "effects/explore/porch/sniff", delay: 0.5 }],
  text: () => ["You smell the flowers. They smell... flowery."],
  next: () => nodeStore.set(porchOptions)
}

const underBench: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking under the bench.", suspicious: true, roomFlags: { porch: { underBench: true }}}),
  backgroundUrl: backgrounds.underBench,
  text: () => ["You take a look under the bench. Right the back are some containers that look like rat poison."],
  next: () => nodeStore.set(porchOptions)
}

const takePoison: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking something from under the bench.", suspicious: true, weapon: "ratPoison" }),
  backgroundUrl: backgrounds.ratPoison,
  sounds: [{filePath: "explore/dining/pickup"}],
  text: () => ["You take the rat poison from under the bench and hide it in your jacket."],
  next: () => nodeStore.set(porchOptions)
}

const inspectBicycle: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the bicycle.", buffs: { muddy: true }, roomFlags: { porch: { inspectBicycle: true }}}),
  backgroundUrl: backgrounds.bicycle,
  text: () => [
    "You inspect the bicycle. The tires are muddy, and now you are muddy too.",
    "Other than dirty tires and missing magnetron, there's nothing unusual about it.",
  ],
  next: () => nodeStore.set(porchOptions)
}
