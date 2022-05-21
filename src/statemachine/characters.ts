import type { CharacterLabels } from "./controller";

function getCharacterUrls<POSES extends string>(character: CharacterLabels, poses: POSES[]): Record<POSES, string> {
  const urls: Record<POSES, string> = {} as Record<POSES, string>;
  poses.forEach(pose => {
    urls[pose] = `/notimetostalk/assets/characters/${character}/${pose}.png`
  });
  return urls;
}

export const characters = {
  red: getCharacterUrls("red", [
    "smile",
    "neutral",
    "suspicious",
    "nervous",
    "angry"
  ]),
  yellow: getCharacterUrls("yellow", [
    "smile",
    "neutral",
    "suspicious",
    "nervous",
    "angry"
  ]),
  pink: getCharacterUrls("pink", [
    "smile",
    "neutral",
    "suspicious",
    "nervous",
    "angry"
  ]),
  green: getCharacterUrls("green", [
    "smile",
    "neutral",
    "suspicious",
    "nervous",
    "angry"
  ]),
  blue: getCharacterUrls("blue", [
    "smile",
    "neutral",
    "suspicious",
    "nervous",
    "angry"
  ]),
  black: getCharacterUrls("black", [
    "smile",
    "neutral",
    "suspicious",
    "nervous",
    "angry"
  ]),
  futureLady: getCharacterUrls("futureLady", [
    "desperate",
    "smile",
    "neutral",
    "sly",
    "serious",
    "shocked",
    "confused"
  ]),
  host: getCharacterUrls("host", [
    "happy",
    "confused",
    "neutral",
    "suspicious"
  ]),
  dog: getCharacterUrls("dog", ["happy", "neutral", "suspicious"]),
  futureRando: getCharacterUrls("futureRando", ["angry", "confused", "desperate"]),
  investigator: getCharacterUrls("investigator", ["serious", "speaking", "listening", "neutral"]),
} as const;
const _assertCharacters: Record<CharacterLabels, Record<string, string>> = characters;