import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { atriumStart } from "./atrium";
import { bathroomStart } from "./bathroom";
import { confirmWeapon, isHoldingWeapon, isHostHere } from "./explore";
import { getGlobalOptions } from "./global";
import { masterBedroomStart } from "./masterBedroom";
import { secondBedroomStart } from "./secondBedroom";
import { nodeStore, updateState } from "../state";

export type LandingFlags = {
  lookAround: boolean;
  dogBed: boolean;
  plants: boolean;
  cracks: boolean;
};

const backgrounds = makeBackgrounds("landing", [
  "wide",
  "dogBed",
  "teddy",
  "cracks",
  "plants",
  "herbs"
])

export const landingStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "entering the landing.", location: "landing" }),
  backgroundUrl: backgrounds.wide,
  text: () => ["You are on the upstairs landing."],
  next: () => nodeStore.set(landingOptions)
}

const landingOptions: OptionNode = {
  type: "OPTION",
  onEnter: updateState({ action: "not doing much." }),
  prompt: "What do you want to do?",
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.landing.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround)
    },
    {
      visible: state => state.explore.roomFlags.landing.lookAround && !state.explore.roomFlags.landing.dogBed,
      text: "Look at the dog's bed",
      next: () => nodeStore.set(dogBed)
    },
    {
      visible: state => state.explore.roomFlags.landing.lookAround,
      text: "Hug the teddy",
      next: () => nodeStore.set(hugTeddy)
    },
    {
      visible: state => state.explore.roomFlags.landing.lookAround && !state.explore.roomFlags.landing.cracks,
      text: "Inspect the walls",
      next: () => nodeStore.set(inspectCracks)
    },
    {
      visible: state => state.explore.roomFlags.landing.lookAround && !state.explore.roomFlags.landing.plants,
      text: "Inspect the plants",
      next: () => nodeStore.set(inspectPlants)
    },
    ...getGlobalOptions(() => landingOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.landing.lookAround && state.explore.roomFlags.landing.plants && !isHoldingWeapon(state, "herbs"),
      text: "Take some herbs",
      next: state => confirmWeapon(state, landingOptions, takeHerbs),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go downstairs",
      next: () => nodeStore.set(atriumStart)
    },
    {
      text: "Go into master bedroom",
      next: () => nodeStore.set(masterBedroomStart)
    },
    {
      text: "Go into the second bedroom",
      next: () => nodeStore.set(secondBedroomStart)
    },
    {
      text: "Go into the bathroom",
      next: () => nodeStore.set(bathroomStart)
    },
  ]
}

const lookAround: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "having a look around.", roomFlags: { landing: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide,
  text: () => ["You have a look around the landing. You notice that, compared to the downstairs' bright decadence, upstairs seems to be a bit more neglected and dark."],
  next: () => nodeStore.set(landingOptions)
}

const dogBed: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking at the dog bed.", roomFlags: { landing: { dogBed: true }}}),
  backgroundUrl: backgrounds.dogBed,
  text: () => ["You inspect the dog's bed. You reckon Goldie has some really sweet dreams here, running around fields and playing with balls to his heart's content."],
  next: () => nodeStore.set(landingOptions)
}

const hugTeddy: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "hugging the stuffed bear.", suspicious: true }),
  backgroundUrl: backgrounds.teddy,
  text: () => ["You give the teddy a big hug. Embracing the bear is warm and comfortable. You feel a little better now."],
  next: () => nodeStore.set(landingOptions)
}

const inspectCracks: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking closely at the walls.", roomFlags: { landing: { cracks: true }}}),
  backgroundUrl: backgrounds.cracks,
  text: () => ["You inspect the cracks in the walls. They look very deep, like someone's carved into the wall."],
  next: () => nodeStore.set(landingOptions)
}

const inspectPlants: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the plants.", roomFlags: { landing: { plants: true }}}),
  backgroundUrl: backgrounds.plants,
  text: () => ["You look at the plant wall - you never expected to see anything like this in the past! There are various plants, including a few that look like herbs."],
  next: () => nodeStore.set(landingOptions)
}

const takeHerbs: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "doing something to the plant wall.", weapon: "herbs", suspicious: true }),
  backgroundUrl: backgrounds.herbs,
  text: () => ["After careful deliberation of what each plant could be, you take some of what you believe to be herbs from the plant wall."],
  next: () => nodeStore.set(landingOptions)
}
