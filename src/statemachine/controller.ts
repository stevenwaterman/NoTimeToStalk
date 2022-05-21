import { get_store_value } from "svelte/internal";
import { derived, Readable, Writable, writable } from "svelte/store";
import type { CharacterTimeline, CharacterTimelineStep, RoomFlags } from "./explore/explore";
import { characterStateStore, fetchedStateStore, otherCharacterStateStore, postDataStore, roomFlagsStore, timeStore, UserInput, userInputStore } from "./state";

export const volumeStore: Writable<number> = writable(0.5);

export type GameState = {
  character: ExploreCharacters;
  backstories: Partial<Record<ExploreCharacters, number>>;
  alibis: Partial<Record<ExploreCharacters, string>>;
  userInput: UserInput
  explore: {
    time: number;
    roomFlags: RoomFlags;
    characterState: CharacterTimelineStep;
    otherCharacterState: Partial<Record<ExploreCharacters, CharacterTimelineStep>>;
  }
}

export const gameStateStore: Readable<GameState> = derived(
  [fetchedStateStore, timeStore, roomFlagsStore, characterStateStore, otherCharacterStateStore, userInputStore], 
  ([fetchedState, timeState, roomFlagsState, characterState, otherCharacterState, userInputState]) => ({
    character: fetchedState.character,
    userInput: userInputState,
    backstories: fetchedState.backstories,
    alibis: fetchedState.alibis,
    explore: {
      time: timeState.time,
      roomFlags: roomFlagsState,
      characterState: characterState,
      otherCharacterState: otherCharacterState
    }
}))

export type Option = {
  text: string;
  next: (state: GameState) => void;
  visible?: (state: GameState) => boolean;
  disabledReasons?: Array<{
    disabled: (state: GameState) => boolean;
    reason: string
  }>
}

type BaseNode = {
  onEnter?: (state: GameState) => void;
  speaker?: string;
  leftCharacterUrl?: string;
  rightCharacterUrl?: string;
  backgroundUrl?: string;
  sounds?: Array<{
    filePath: string;
    volume?: number;
    delay?: number;
  }>;
}

export type MonologueNode = BaseNode & {
  type: "MONOLOGUE";
  text: (state: GameState) => string[];
  next: (state: GameState) => void;
}

export type InputNode = BaseNode & {
  type: "INPUT";
  prompt: string;
  inputLength: {
    min: number;
    max: number;
  };
  next: (input: string, state: GameState) => void;
}

export type OptionNode = BaseNode & {
  type: "OPTION";
  prompt: string;
  options: Option[];
}

export type IntroNode = BaseNode & {
  type: "INTRO";
  character: CharacterLabels;
  next: (state: GameState) => void;
}

export type GraphNode = MonologueNode | InputNode | OptionNode | IntroNode;

export type ExploreCharacters = "red" | "yellow" | "pink" | "green" | "blue" | "black" | "host" | "dog";
export type CharacterLabels = "red" | "yellow" | "pink" | "green" | "blue" | "black" | "futureLady" | "host" | "dog" | "futureRando" | "investigator";

export function makeBackgrounds<KEYS extends string>(folder: string, keys: KEYS[]): Record<KEYS, string> {
  const backgrounds: Record<KEYS, string> = {} as Record<KEYS, string>;
  keys.forEach(key => {
    backgrounds[key] = `/notimetostalk/assets/backgrounds/${folder}/${key}.jpg`;
  });
  return backgrounds;
}

export type Chapter = "introStart" | "introContext" | "introTimeTravel" | "enterCar" | "enterHouse" | "explore" | "lightsOut" | "investigation" | "outroTimeTravel" | "outro" | "outroRando" | "whoopsie" | "debrief"
export const chapterStore: Writable<Chapter> = writable("introContext");

export function postInfo() {
  const body = {
    password: localStorage.getItem("password"),
    ...get_store_value(postDataStore)
  };

  const json = JSON.stringify(body);
  localStorage.setItem("body", json);

  // fetch(`${apiUrl}/game`, {
  //   method: "POST",
  //   body: json,
  //   headers: { 'Content-Type': 'application/json' },
  // })
}
