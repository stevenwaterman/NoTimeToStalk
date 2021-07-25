import { derived, Readable, writable, Writable } from "svelte/store";
import type { ExploreCharacters, GameState, GraphNode } from "./controller";
import { atriumStart } from "./explore/atrium";
import type { Buffs, CharacterTimeline, CharacterTimelineStep, Locations, RoomFlags, Weapon } from "./explore/explore";
import { exploreStart } from "./explore/start";
import { introStart } from "./intro/context";

const internalSecondsStore: Writable<{ time: number, paused: boolean }> = writable({ time: 0, paused: true });
let interval: NodeJS.Timer | null = null;

function unpause() {
  internalSecondsStore.update(state => {
    if (!state.paused) return state;
    interval = setInterval(() => {
      internalSecondsStore.update(state => ({ ...state, time: state.time + 1}));
    }, 1000)
    return { ...state, paused: false }
  })
}

function pause() {
  if (!interval) return;
  internalSecondsStore.update(state => {
    if (state.paused) return state;
    clearInterval(interval)
    return { ...state, paused: true }
  })
}

export const timeStore: Readable<{ time: number, paused: boolean}> & { pause: () => void; unpause: () => void } = {
  subscribe: internalSecondsStore.subscribe,
  pause,
  unpause
}

export const pausedStore: Readable<boolean> = derived(timeStore, ({paused}) => paused);

type FetchedState = {
  character: ExploreCharacters;
  backstories: Partial<Record<ExploreCharacters, number>>;
  alibis: Partial<Record<ExploreCharacters, string>>;
  timeline: Partial<Record<ExploreCharacters, CharacterTimeline>>;
}

export const fetchedStateStore: Writable<FetchedState> = writable({
  character: "black",
  backstories: {},
  alibis: {},
  timeline: {}
});
export const characterStore: Readable<ExploreCharacters> = derived(fetchedStateStore, state => state?.character);


const otherCharacterTimeline: Readable<{
  time: number,
  timeline: Partial<Record<ExploreCharacters, CharacterTimeline>>
}> = derived([timeStore, fetchedStateStore], ([timeState, fetchedState]) => ({
  time: timeState.time,
  timeline: fetchedState?.timeline ?? {}
}));

const otherCharacterStateInternal: Writable<Partial<Record<ExploreCharacters, CharacterTimelineStep>>> = writable({});

otherCharacterTimeline.subscribe(({time, timeline}) => {
  otherCharacterStateInternal.update(otherCharacterState => {
    Object.entries(timeline).forEach(([character, characterTimeline]) => {
      const step = characterTimeline[time];
      if(step !== undefined) otherCharacterState[character] = step;
    })
    return otherCharacterState;
  })
})

export const otherCharacterStateStore: Readable<Partial<Record<ExploreCharacters, CharacterTimelineStep>>> = { subscribe: otherCharacterStateInternal.subscribe }



const characterTimelineInternal: Writable<CharacterTimeline> = writable({});
const characterStateInternal: Writable<CharacterTimelineStep> = writable({
  location: "atrium",
  action: "not doing much",
  weapon: "nothing",
  buffs: {
    wet: false,
    muddy: false,
    pretty: false,
    injured: false,
    painty: false
  },
  suspicious: false
});

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type StateOverrides = {
  action?: string;
  location?: Locations;
  weapon?: Weapon;
  buffs?: Partial<Buffs>;
  suspicious?: boolean;
  roomFlags?: DeepPartial<RoomFlags>
}


function updateCharacterState(time: number, overrides: StateOverrides) {
  characterStateInternal.update(state => {
    const action = overrides.action ?? state.action;
    const location = overrides["location"] ?? state.location;
    const weapon = overrides.weapon ?? state.weapon;
    const suspicious = overrides.suspicious ?? false;
    const buffs = {
      ...state.buffs,
      ...overrides.buffs ?? {}
    };
    const newState: CharacterTimelineStep = { action, location, weapon, buffs, suspicious };

    characterTimelineInternal.update(timeline => {
      timeline[time] = newState;
      return timeline;
    });
    return newState;
  });

  if (overrides.roomFlags) {
    roomFlagsStore.update(flags => {
      Object.entries(overrides.roomFlags).forEach(([room, roomFlags]) => {
        flags[room] = {
          ...flags[room],
          ...roomFlags
        }
      })
      return flags;
    })
  }  
}

export function updateState(overrides: StateOverrides): (state: GameState) => void {
  return (state: GameState) => {
    characterStateStore.update(state.explore.time, overrides);
  }
}

export const characterStateStore = {
  subscribe: characterStateInternal.subscribe,
  update: updateCharacterState
}

export const setCharacterState = characterStateStore.update;

export const roomFlagsStore: Writable<RoomFlags> = writable({
  kitchen: {
    lookAround: false,
    cooking: false,
    pantry: false,
    cupboards: false,
    stolenRecipe: false,
    chalkBoard: false
  },
  dining: {
    lookAround: false,
    cabinets: false,
    boat: false,
    paintings: false,
    cloche: false
  },
  atrium: {
    lookAround: false,
    underRug: false,
    feelFlame: false,
    sideboard: false,
    art: false
  },
  porch: {
    lookAround: false,
    smellFlowers: false,
    inspectBicycle: false,
    underBench: false
  },
  garden: {
    lookAround: false,
    graves: false,
    climbTree: false,
    fountain: false,
    vegetables: false
  },
  study: {
    lookAround: false,
    desk: false,
    globe: false,
    paperwork: false,
    chess: false,
    blunder: false,
    painting: false,
    art: false
  },
  lounge: {
    lookAround: false,
    medicine: false,
    bookcase: false,
    fish: false,
    art: false
  },
  landing: {
    lookAround: false,
    dogBed: false,
    plants: false,
    cracks: false
  },
  bathroom: {
    lookAround: false,
    toiletRoll: false,
    cabinet: false,
    window: false
  },
  secondBedroom: {
    lookAround: false,
    cobwebs: false,
    picture: false,
    textbook: false,
    toyBox: false,
    artwork: false,
    diary: false,
    dollsHouse: false,
    wardrobe: false
  },
  masterBedroom: {
    lookAround: false,
    inWardrobe: false,
    underBed: false,
    takenMoney: false,
    bedsideTables: false,
    art: false,
    mirror: false
  },
  secretPassage: {
    lookAround: false,
    gnomes: false,
  },
  balcony: {
    lookAround: false,
    telescope: false
  },
  global: {
    attemptedMurder: {
      nothing: false,
      knife: false,
      herbs: false,
      candlestick: false,
      letterOpener: false,
      ratPoison: false,
      spade: false,
      poison: false,
      sword: false,
      doll: false,
      drugs: false,
      scythe: false,
      umbrella: false,
      dogTreat: false,
      lute: false
    }
  }
});


export const nodeStore: Writable<GraphNode> = writable(introStart);

export type UserInput = {
  name?: string;
  backstory?: 1 | 2 | 3;
  alibi?: string;
  accused?: ExploreCharacters;
  accusedReason?: string;
}

export const userInputStore: Writable<UserInput> = writable({});

export const postDataStore: Readable<{
  name: string;
  character: ExploreCharacters;
  backstory: 1 | 2 | 3;
  alibi: string;
  accused: ExploreCharacters;
  accusedReason: string;
  timeline: CharacterTimeline
}> = derived([userInputStore, characterStore, characterTimelineInternal], ([userInput, character, characterTimeline]) => ({
  name: userInput.name,
  character,
  backstory: userInput.backstory,
  alibi: userInput.alibi,
  accused: userInput.accused,
  accusedReason: userInput.accusedReason,
  timeline: characterTimeline
}));
