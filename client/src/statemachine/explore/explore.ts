import type { ExploreCharacters, GameState, GraphNode } from "../controller";
import type { AtriumFlags } from "./atrium";
import type { LoungeFlags } from "./lounge";
import type { DiningFlags } from "./dining";
import type { KitchenFlags } from "./kitchen";
import type { StudyFlags } from "./study";
import type { PorchFlags } from "./porch";
import type { GardenFlags } from "./garden";
import type { LandingFlags } from "./landing";
import type { BathroomFlags } from "./bathroom";
import type { SecondBedroomFlags } from "./secondBedroom";
import type { MasterBedroomFlags } from "./masterBedroom";
import type { BalconyFlags } from "./balcony";
import type { SecretPassageFlags } from "./secretPassage";
import { characterStore, nodeStore } from "../state";
import { names, weapons } from "../../names";

export type Weapon = "nothing" | "knife" | "herbs" | "candlestick" | "letterOpener" | "ratPoison" | "spade" | "poison" | "sword" | "doll" | "drugs" | "scythe" | "umbrella" | "dogTreat" | "lute";
export type Locations = "kitchen" | "dining" | "atrium" | "porch" | "garden" | "study" | "lounge" | "landing" | "bathroom" | "masterBedroom" | "secondBedroom" | "secretPassage" | "balcony";

export type RoomFlags = {
  kitchen: KitchenFlags,
  dining: DiningFlags,
  atrium: AtriumFlags,
  porch: PorchFlags,
  garden: GardenFlags,
  study: StudyFlags,
  lounge: LoungeFlags,
  landing: LandingFlags,
  bathroom: BathroomFlags,
  secondBedroom: SecondBedroomFlags,
  masterBedroom: MasterBedroomFlags,
  secretPassage: SecretPassageFlags,
  balcony: BalconyFlags,
  global: {
    attemptedMurder: Record<Weapon, boolean>
  }
}

export type Buffs = {
  wet: boolean;
  injured: boolean;
  muddy: boolean;
  pretty: boolean;
  painty: boolean;
}

export type CharacterTimelineStep = {
  location: Locations;
  action: string;
  weapon: Weapon;
  buffs: Buffs;
  suspicious: boolean;
}
export type CharacterTimeline = Record<number, CharacterTimelineStep>;

export function otherCharactersAtLocation(state: GameState, location: Locations): Partial<Record<ExploreCharacters, CharacterTimelineStep>> {
  const filtered: Partial<Record<ExploreCharacters, CharacterTimelineStep>> = {};
  Object.entries(state.explore.otherCharacterState).forEach(([character, step]) => {
    if(step.location === location) filtered[character] = step
  });

  return filtered;
}

export function isHostHere(state: GameState): boolean {
  return state.explore.otherCharacterState.host?.location === state.explore.characterState.location;
}

export function isDogHere(state: GameState): boolean {
  return state.explore.otherCharacterState.dog?.location === state.explore.characterState.location;
}

export function isHoldingWeapon(state: GameState, weapon: Weapon): boolean {
  return state.explore.characterState.weapon === weapon;
}

export function gardenCharacters(state: GameState): string[] {
  const others = otherCharactersAtLocation(state, "garden");
  const text = Object.entries(others).map(([character, step]) => lookAroundCharacter(character, "in the garden", step));
  if (text.length === 0) {
    text.push("You can't see anyone in the garden.");
  }
  return text;
}

export function balconyCharacters(state: GameState): string[] {
  const others = otherCharactersAtLocation(state, "balcony");
  const text = Object.entries(others).map(([character, step]) => lookAroundCharacter(character, "on the balcony", step));
  if (text.length === 0) {
    text.push("You can't see anyone on the balcony.");
  }
  return text;
}

export function loungeWindowCharacters(state: GameState): string[] {
  const lounge = otherCharactersAtLocation(state, "lounge");
  
  const loungeText = Object.entries(lounge).map(([character, step]) => lookAroundCharacter(character, "in the lounge", step));
  if (loungeText.length === 0) {
    loungeText.push("You can't see anyone in the lounge.")
  }

  return [
    "You look through the lounge window.",
    ...loungeText,
  ];
}

export function studyWindowCharacters(state: GameState): string[] {
  const study = otherCharactersAtLocation(state, "study");
  
  const studyText = Object.entries(study).map(([character, step]) => lookAroundCharacter(character, "in the study", step));
  if (studyText.length === 0) {
    studyText.push("You can't see anyone in the study.")
  }

  return [
    "You look through the study window.",
    ...studyText,
  ];
}

export function bathroomWindowCharacters(state: GameState): string[] {
  const bathroom = otherCharactersAtLocation(state, "bathroom");
  const bathroomText = Object.keys(bathroom).length > 0 ? "There is someone in the bathroom, but the frosted glass means you can't make out who it is." : "You can't see anyone in the bathroom.";

  return [
    "You look through the bathroom window.",
    bathroomText
  ];
}

export function lookAroundCharacter(character: string, location: string, timestep: CharacterTimelineStep): string {
  let out = `${names[character]} is ${location}, ${timestep.action}`

  switch (timestep.weapon) {
    case "candlestick":
      out += " They are holding a candlestick.";
      break;
    case "spade":
      out += " They are holding a spade.";
      break;
    case "sword":
      out += " They are holding a longsword.";
      break;
    case "scythe":
      out += " They are holding a scythe.";
      break;
    case "umbrella":
      out += " They are holding an umbrella.";
      break;
    case "lute":
      out += " They are carrying a lute.";
      break;
  }

  if (timestep.buffs.injured) {
    out += " They are injured.";
  }
  if (timestep.buffs.muddy) {
    out += " They are muddy.";
  }
  if (timestep.buffs.painty) {
    out += " They are covered in paint.";
  }
  if (timestep.buffs.pretty) {
    out += " They look different than when you arrived. Prettier, perhaps.";
  }
  if (timestep.buffs.wet) {
    out += " They are all wet.";
  }

  return out;
}

export function alibiCharacter(character: ExploreCharacters, state: GameState): string {
  const timestep = state.explore.otherCharacterState[character];
  let out = `${names[character]} is next.`

  switch (timestep.weapon) {
    case "candlestick":
      out += " They are holding a candlestick.";
      break;
    case "spade":
      out += " They are holding a spade.";
      break;
    case "sword":
      out += " They are holding a longsword.";
      break;
    case "scythe":
      out += " They are holding a scythe.";
      break;
    case "umbrella":
      out += " They are holding an umbrella.";
      break;
    case "lute":
      out += " They are carrying a lute.";
      break;
  }

  if (timestep.buffs.injured) {
    out += " They are injured.";
  }
  if (timestep.buffs.muddy) {
    out += " They are muddy.";
  }
  if (timestep.buffs.painty) {
    out += " They are covered in paint.";
  }
  if (timestep.buffs.pretty) {
    out += " They look different than when you arrived. Prettier, perhaps.";
  }
  if (timestep.buffs.wet) {
    out += " They are all wet.";
  }

  return out;
}

export function hasBuff(state: GameState, buff: keyof Buffs): boolean {
  return state.explore.characterState.buffs[buff];
}

export function confirmWeapon(state: GameState, backNode: GraphNode, targetNode: GraphNode): void {
  const weapon = state.explore.characterState.weapon;
  if (weapon === "nothing") nodeStore.set(targetNode);
  else {
    nodeStore.set({
      type: "OPTION",
      backgroundUrl: targetNode.backgroundUrl,
      prompt: `Are you sure? This will drop your ${weapons[weapon]}`,
      options: [
        {
          text: "Cancel",
          next: () => nodeStore.set(backNode)
        },
    {
          text: "Confirm",
          next: () => nodeStore.set(targetNode)
        }
      ]
    });
  }
}