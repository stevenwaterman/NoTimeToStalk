import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { atriumStart } from "./atrium";
import { confirmWeapon, isHoldingWeapon, isHostHere } from "./explore";
import { getGlobalOptions } from "./global";
import { kitchenStart } from "./kitchen";
import { nodeStore, updateState } from "../state";

export type DiningFlags = {
  lookAround: boolean;
  cabinets: boolean;
  boat: boolean;
  paintings: boolean;
  cloche: boolean;
};

const backgrounds = makeBackgrounds("dining", [
  "wide",
  "wide1",
  "wide2",
  "boat",
  "cabinets",
  "table",
  "candlestick",
  "paintings1",
  "paintings2",
  "paintings3",
  "drink",
  "cloche"
])

export const diningStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "entering the room.", location: "dining" }),
  backgroundUrl: backgrounds.wide,
  text: () => ["You are in the dining room."],
  next: () => nodeStore.set(diningOptions)
}

const diningOptions: OptionNode = {
  type: "OPTION",
  prompt: "What do you want to do?",
  onEnter: updateState({ action: "not doing much." }),
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.dining.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround1)
    },
    {
      visible: state => state.explore.roomFlags.dining.lookAround && !state.explore.roomFlags.dining.cabinets,
      text: "Admire the cabinets",
      next: () => nodeStore.set(admireCabinets)
    },
    {
      visible: state => state.explore.roomFlags.dining.lookAround && !state.explore.roomFlags.dining.boat,
      text: "Admire the model boat",
      next: () => nodeStore.set(admireBoat)
    },
    {
      visible: state => state.explore.roomFlags.dining.lookAround,
      text: "Sit at the table",
      next: () => nodeStore.set(sitDown)
    },
    {
      visible: state => state.explore.roomFlags.dining.lookAround && !state.explore.roomFlags.dining.paintings,
      text: "View the paintings",
      next: () => nodeStore.set(viewPaintings1)
    },
    ...getGlobalOptions(() => diningOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.dining.lookAround && !state.explore.roomFlags.dining.cloche,
      text: "Peek under the cloche",
      next: () => nodeStore.set(underCloche),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.dining.lookAround,
      text: "Swap the drinks",
      next: () => nodeStore.set(swapDrinks),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.dining.lookAround && state.explore.roomFlags.dining.cabinets && !isHoldingWeapon(state, "candlestick"),
      text: "Take a candlestick",
      next: state => confirmWeapon(state, diningOptions, takeCandlestick),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.dining.lookAround && isHoldingWeapon(state, "poison"),
      text: "Add arsenic to the drinks",
      next: () => nodeStore.set(addPoison),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.dining.lookAround && isHoldingWeapon(state, "ratPoison"),
      text: "Add rat poison to the drinks",
      next: () => nodeStore.set(addRatPoison),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go into the Kitchen",
      next: () => nodeStore.set(kitchenStart)
    },
    {
      text: "Go into the Atrium",
      next: () => nodeStore.set(atriumStart)
    },
  ]
}

const lookAround1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "having a look around.", roomFlags: { dining: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide1,
  text: () => [
    "You have a look around the luxurious dining room.",
    "You're mesmerised by the detailing of the room and its utility for large social gatherings over food. You feel excited for the meal ahead."
  ],
  next: () => nodeStore.set(lookAround2)
}

const lookAround2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide2,
  text: () => ["You see that the table has been mostly set for dinner already, with drinks pre-poured and the Admiral's elegant personality shining through with the bottle holders. All corners of this room feel truly magnificent."],
  next: () => nodeStore.set(diningOptions)
}

const admireBoat: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the model boat.", roomFlags: { dining: { boat: true }}}),
  backgroundUrl: backgrounds.boat,
  text: () => ["You stop to admire the model boat under the window. It looks incredibly detailed. Is it a model of one of the Admiral's pirate ships? Or even his dream ship?"],
  next: () => nodeStore.set(diningOptions)
}

const admireCabinets: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the cabinets.", roomFlags: { dining: { cabinets: true }}}),
  backgroundUrl: backgrounds.cabinets,
  text: () => ["You admire the cabinets. They contain various bits of china, a few old books, and some heavy candlesticks, all meaningfully placed for aesthetic charm."],
  next: () => nodeStore.set(diningOptions)
}

const underCloche: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking under the cloche.", suspicious: true, roomFlags: { dining: { cloche: true }}}),
  sounds: [{ filePath: "effects/explore/dining/cloche", delay: 1 }],
  backgroundUrl: backgrounds.cloche,
  text: () => ["You peek under the cloche. A fly comes out.", "It seems that dinner isn't as close to being served as you thought, unless you're eating fly cakes."],
  next: () => nodeStore.set(diningOptions)
}

const sitDown: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "sitting at the table." }),
  backgroundUrl: backgrounds.table,
  sounds: [{filePath: "effects/explore/atrium/sit", volume: 0.4}],
  text: () => ["You pick a seat at the table and sit down. Even with your incredible patience, it doesn't make the food arrive any quicker. You get up again."],
  next: () => nodeStore.set(diningOptions)
}

const takeCandlestick: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking something out of the cabinets.", suspicious: true, weapon: "candlestick" }),
  sounds: [{filePath: "explore/dining/pickup"}],
  backgroundUrl: backgrounds.candlestick,
  text: () => ["You take a candlestick from the cabinet."],
  next: () => nodeStore.set(diningOptions)
}

const swapDrinks: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "swapping the Admiral's drink with someone else's.", suspicious: true }),
  backgroundUrl: backgrounds.drink,
  sounds: [{ filePath: "effects/explore/dining/swapDrinks", delay: 0.5 }],
  text: () => [
    "You swap the Admiral's drink with someone else's. That should stop him getting poisoned.", 
    "...Unless they put poison in it now, that is."
  ],
  next: () => nodeStore.set(diningOptions)
}

const viewPaintings1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the paintings.", roomFlags: { dining: { paintings: true }}}),
  backgroundUrl: backgrounds.paintings1,
  text: () => ["You admire the paintings that fill the dining room. Above the table is a grand portrait of a man and a dog - was this the Admiral and Goldie a few years ago, or another past dog friend?"],
  next: () => nodeStore.set(viewPaintings2)
}

const viewPaintings2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.paintings2,
  text: () => ["On another wall are two other portraits, but you don't recognise these two people. You ponder their significance. Are they family members? Friends? Did the Admiral just buy them at auction because they looked cool?"],
  next: () => nodeStore.set(viewPaintings3)
}

const viewPaintings3: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.paintings3,
  text: () => ["There's more landscape paintings next to the door. The sea truly seems beautiful. The Admiral must have many fond memories of his travels."],
  next: () => nodeStore.set(diningOptions)
}

const addPoison: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "adding something to the Admiral's drink.", weapon: "nothing", suspicious: true }),
  backgroundUrl: backgrounds.drink,
  sounds: [{ filePath: "effects/explore/dining/pour", delay: 0.5 }],
  text: () => ["Sneakily, you add the arsenic you found earlier to the Admiral's drink."],
  next: () => nodeStore.set(diningOptions)
}

const addRatPoison: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "adding something to the Admiral's drink", weapon: "nothing", suspicious: true }),
  backgroundUrl: backgrounds.drink,
  sounds: [{ filePath: "effects/explore/dining/pour", delay: 0.5 }],
  text: () => ["Sneakily, you add the rat poison you found earlier to the Admiral's drink."],
  next: () => nodeStore.set(diningOptions)
}
