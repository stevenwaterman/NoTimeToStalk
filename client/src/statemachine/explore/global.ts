import type { OptionNode, GameState, Option, MonologueNode } from "../controller";
import { isDogHere, isHoldingWeapon, isHostHere, Weapon } from "./explore";
import { nodeStore, updateState } from "../state";
import { characters } from "../characters";

function attemptedMurder(state: GameState, weapon: Weapon): boolean {
  return state.explore.roomFlags.global.attemptedMurder[weapon];
}

export function getGlobalOptions(node: () => OptionNode, wideBg: string): Option[] {
  return [
    {
      visible: state => isHoldingWeapon(state, "lute"),
      text: "Play the lute",
      next: () => nodeStore.set(playLute(node, wideBg))
    },
    {
      visible: state => isDogHere(state),
      text: "Pet Goldie",
      next: () => nodeStore.set(petDog(node, wideBg))
    },
    {
      visible: state => isDogHere(state) && isHoldingWeapon(state, "dogTreat"),
      text: "Give Goldie a treat",
      next: () => nodeStore.set(dogTreat(node, wideBg))
    },
    {
      visible: state => isHostHere(state) && !attemptedMurder(state, "knife") && isHoldingWeapon(state, "knife"),
      text: "Stab the Admiral with your knife",
      next: () => nodeStore.set(murderHost(node, wideBg, "knife"))
    },
    {
      visible: state => isHostHere(state) && !attemptedMurder(state, "candlestick") && isHoldingWeapon(state, "candlestick"),
      text: "Bludgeon the Admiral with your candlestick",
      next: () => nodeStore.set(murderHost(node, wideBg, "candlestick"))
    },
    {
      visible: state => isHostHere(state) && !attemptedMurder(state, "letterOpener") && isHoldingWeapon(state, "letterOpener"),
      text: "Stab the Admiral with your letter opener",
      next: () => nodeStore.set(murderHost(node, wideBg, "letterOpener"))
    },
    {
      visible: state => isHostHere(state) && !attemptedMurder(state, "spade") && isHoldingWeapon(state, "spade"),
      text: "Bludgeon the Admiral with your spade",
      next: () => nodeStore.set(murderHost(node, wideBg, "spade"))
    },
    {
      visible: state => isHostHere(state) && !attemptedMurder(state, "sword") && isHoldingWeapon(state, "sword"),
      text: "Impale the Admiral on your sword",
      next: () => nodeStore.set(murderHost(node, wideBg, "sword"))
    },
    {
      visible: state => isHostHere(state) && !attemptedMurder(state, "doll") && isHoldingWeapon(state, "doll"),
      text: "Murder the Admiral with your voodoo doll",
      next: () => nodeStore.set(murderHost(node, wideBg, "doll"))
    },
    {
      visible: state => isHostHere(state) && !attemptedMurder(state, "scythe") && isHoldingWeapon(state, "scythe"),
      text: "Reap the Admiral with your scythe",
      next: () => nodeStore.set(murderHost(node, wideBg, "scythe"))
    }
  ]
}

function playLute(node: () => OptionNode, wideBg: string): MonologueNode {
  return {
    type: "MONOLOGUE",
    onEnter: updateState({ action: "playing the lute." }),
    sounds: [{ filePath: "effects/explore/global/lute" }],
    backgroundUrl: wideBg,
    text: () => ["You play the lute"],
    next: () => nodeStore.set(node())
  }
}

function petDog(node: () => OptionNode, wideBg: string): MonologueNode {
  return {
    type: "MONOLOGUE",
    onEnter: updateState({ action: "petting Goldie." }),
    sounds: [{ filePath: "effects/explore/global/woof", delay: 0.5 }],
    backgroundUrl: wideBg,
    leftCharacterUrl: characters.dog.happy,
    text: () => ["You pet Goldie. He seems to like you!"],
    next: () => nodeStore.set(node())
  }
}

function dogTreat(node: () => OptionNode, wideBg: string): MonologueNode {
  return {
    type: "MONOLOGUE",
    onEnter: updateState({ action: "giving Goldie a treat.", weapon: "nothing" }),
    backgroundUrl: wideBg,
    sounds: [{ filePath: "effects/explore/global/dogTreat" }],
    leftCharacterUrl: characters.dog.happy,
    text: () => ["You give Goldie a treat. He now loves you and will die for you."],
    next: () => nodeStore.set(node())
  }
}

function murderHost(node: () => OptionNode, wideBg: string, weapon: Weapon): MonologueNode {
  return {
    type: "MONOLOGUE",
    onEnter: state => { 
      state.explore.roomFlags.global.attemptedMurder[weapon] = true;
      updateState({ action: "eyeing the Admiral suspiciously.", suspicious: true })(state)
    },
    backgroundUrl: wideBg,
    sounds: [{ filePath: "effects/explore/global/murder" }],
    leftCharacterUrl: characters.host.confused,
    text: () => [
      "Yes, murdering the Admiral yourself WOULD make it very easy to know who murdered him.",
      "It would also mean you go to prison.", 
      "Also, it's quite hard to find the real killer when their target is already dead.",
      "You decide against it."
    ],
    next: () => nodeStore.set(node())
  }
}