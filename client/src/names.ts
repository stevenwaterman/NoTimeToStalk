import type { CharacterLabels } from "./statemachine/controller";
import type { Weapon } from "./statemachine/explore/explore";

export const names = {
  red: "Miss Scarlett",
  yellow: "Laurence Amber",
  pink: "Rosie Barnett",
  green: "Dr. Pea",
  blue: "Sapphire Montgomery",
  black: "Mr. Cole",
  futureLady: "Ms. Anabelle",
  host: "Admiral Thomas",
  dog: "Goldie",
  futureRando: "???",
  you: "You",
  investigator: "Detective Al"
} as const;
const _assertNames: Record<CharacterLabels | "you", string> = names;

export const weapons = {
  nothing: null,
  knife: "knife",
  herbs: "herbs",
  candlestick: "candlestick",
  letterOpener: "letter opener",
  ratPoison: "rat poison",
  spade: "spade",
  poison: "poison",
  sword: "sword",
  doll: "voodoo doll",
  drugs: "drugs",
  scythe: "scythe",
  umbrella: "umbrella",
  dogTreat: "dog treat",
  lute: "lute"
} as const;
const _assertWeapons: Record<Weapon, string | null> = weapons;