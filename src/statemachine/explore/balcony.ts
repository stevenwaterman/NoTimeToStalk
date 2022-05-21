import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { gardenCharacters, hasBuff, isHoldingWeapon, isHostHere } from "./explore";
import { gardenStartIvy } from "./garden";
import { getGlobalOptions } from "./global";
import { masterBedroomStart } from "./masterBedroom";
import { nodeStore, updateState } from "../state";

export type BalconyFlags = {
  lookAround: boolean;
  telescope: boolean;
};

const backgrounds = makeBackgrounds("balcony", [
  "wide",
  "garden",
  "ivy",
  "telescope"
])

export const balconyStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: state => {
    const wet = hasBuff(state, "wet") || !isHoldingWeapon(state, "umbrella");
    updateState({ location: "balcony", action: "entering the balcony.", buffs: { wet }})(state);
  },
  backgroundUrl: backgrounds.wide,
  text: state => [
    "You are on the balcony.",
    isHoldingWeapon(state, "umbrella") ? "It's raining, but your umbrella protects you." : "It's raining, and you're now wet."
  ],
  next: () => nodeStore.set(balconyOptions)
}

const balconyOptions: OptionNode = {
  type: "OPTION",
  prompt: "What do you want to do?",
  onEnter: updateState({ action: "not doing much." }),
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.balcony.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround)
    },
    {
      visible: state => state.explore.roomFlags.balcony.lookAround && !state.explore.roomFlags.balcony.telescope,
      text: "Look through the telescope",
      next: () => nodeStore.set(telescope)
    },
    {
      visible: state => state.explore.roomFlags.balcony.lookAround,
      text: "Look down at the garden",
      next: () => nodeStore.set(lookDown)
    },
    ...getGlobalOptions(() => balconyOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.balcony.lookAround,
      text: "Climb down the ivy to the garden",
      next: () => nodeStore.set(climbIvy),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go back into the master bedroom",
      next: () => nodeStore.set(masterBedroomStart)
    },
  ]
}

const lookAround: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "having a look around.", roomFlags: { balcony: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide,
  text: () => [
    "You have a look around the balcony.", 
    "There's a spectacular view of the surrounding forest from the bench, and a telescope for looking into the sky. It all smells a bit soggy and old, but it's pretty nice out here."
  ],
  next: () => nodeStore.set(balconyOptions)
}

const lookDown: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking down into the garden." }),
  backgroundUrl: backgrounds.garden,
  text: state => [
    "You peek through the tree leaves to look down into the garden.", 
    ...gardenCharacters(state)
  ],
  next: () => nodeStore.set(balconyOptions)
}

const telescope: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking through the telescope.", roomFlags: { balcony: { telescope: true }}}),
  backgroundUrl: backgrounds.telescope,
  text: () => ["You look through the telescope at the stars. There's not as many as you remember, but this is before companies started using artificial stars to advertise."],
  next: () => nodeStore.set(balconyOptions)
}

const climbIvy: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "climbing down the ivy into the garden.", suspicious: true, buffs: { muddy: true }}),
  sounds: [{filePath: "effects/balcony/ivy"}],
  backgroundUrl: backgrounds.ivy,
  text: () => ["You climb down the ivy. It's very slippery from the rain, and you get muddy in the process, but you manage to make it down safely."],
  next: () => nodeStore.set(gardenStartIvy)
}
