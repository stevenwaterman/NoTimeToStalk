import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { atriumStart } from "./atrium";
import { diningStart } from "./dining";
import { confirmWeapon, isHoldingWeapon, isHostHere } from "./explore";
import { getGlobalOptions } from "./global";
import { nodeStore, updateState } from "../state";

export type KitchenFlags = {
  lookAround: boolean;
  cooking: boolean;
  cupboards: boolean;
  pantry: boolean;
  stolenRecipe: boolean;
  chalkBoard: boolean;
};

const backgrounds = makeBackgrounds("kitchen", [
  "wide",
  "wide1",
  "knife",
  "cooking",
  "cupboards",
  "dogTreat",
  "chalkBoard",
  "pantry",
  "recipe"
])

export const kitchenStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "entering the kitchen.", location: "kitchen" }),
  backgroundUrl: backgrounds.wide,
  text: () => ["You are in the kitchen."],
  next: () => nodeStore.set(kitchenOptions)
}

const kitchenOptions: OptionNode = {
  type: "OPTION",
  prompt: "What do you want to do?",
  onEnter: updateState({ action: "not doing much." }),
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.kitchen.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround1)
    },
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && !state.explore.roomFlags.kitchen.cooking,
      text: "Look at what's cooking",
      next: () => nodeStore.set(lookAtCooking)
    },
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && !state.explore.roomFlags.kitchen.pantry,
      text: "Explore the pantry",
      next: () => nodeStore.set(explorePantry)
    },
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && !state.explore.roomFlags.kitchen.chalkBoard,
      text: "Read the chalkboard",
      next: () => nodeStore.set(readChalkboard)
    },
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && !state.explore.roomFlags.kitchen.cupboards,
      text: "Look in all the cupboards",
      next: () => nodeStore.set(openCupboards)
    },
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && state.explore.roomFlags.kitchen.cupboards,
      text: "Eat a biscuit",
      next: () => nodeStore.set(eatBiscuit)
    },
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && state.explore.roomFlags.kitchen.pantry && !isHoldingWeapon(state, "dogTreat"),
      text: "Take a dog treat",
      next: state => confirmWeapon(state, kitchenOptions, dogTreat)
    },
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && state.explore.roomFlags.kitchen.cooking && !state.explore.roomFlags.kitchen.stolenRecipe,
      text: "Steal the recipe",
      next: () => nodeStore.set(stealRecipe)
    },
    ...getGlobalOptions(() => kitchenOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && state.explore.roomFlags.kitchen.cooking && isHoldingWeapon(state, "herbs"),
      text: "Add herbs to the food",
      next: () => nodeStore.set(addHerbs),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && state.explore.roomFlags.kitchen.cooking,
      text: "Add more salt to the food",
      next: () => nodeStore.set(addSalt)
    },
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && !isHoldingWeapon(state, "knife"),
      text: "Take a knife",
      next: state => confirmWeapon(state, kitchenOptions, takeKnife),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && state.explore.roomFlags.kitchen.cooking && isHoldingWeapon(state, "poison"),
      text: "Add arsenic to the food",
      next: () => nodeStore.set(addPoison),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.kitchen.lookAround && state.explore.roomFlags.kitchen.cooking && isHoldingWeapon(state, "ratPoison"),
      text: "Add rat poison to the food",
      next: () => nodeStore.set(addRatPoison),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go into the Dining Room",
      next: () => nodeStore.set(diningStart)
    },
    {
      text: "Go into the Atrium",
      next: () => nodeStore.set(atriumStart)
    },
  ]
}

const lookAround1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "having a look around.", roomFlags: { kitchen: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide,
  text: () => ["You have a look around the kitchen.", "It's quite a dingy room compared to the others in this home, but the smells from the cooking food are spectacular."],
  next: () => nodeStore.set(lookAround2)
}

const lookAround2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide1,
  text: () => ["You notice a pantry, and realise there's plenty of storage in this kitchen, a surprise given only one man and his dog live here."],
  next: () => nodeStore.set(kitchenOptions)
}

const takeKnife: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "stealing a kitchen knife.", weapon: "knife", suspicious: true }),
  backgroundUrl: backgrounds.knife,
  sounds: [{ filePath: "effects/explore/kitchen/knife", delay: 0.5 }],
  text: () => ["You see that a kitchen knife has been left on the counter. You pick up it up and hide it inside your jacket."],
  next: () => nodeStore.set(kitchenOptions)
}

const lookAtCooking: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the food.", roomFlags: { kitchen: { cooking: true }}}),
  backgroundUrl: backgrounds.cooking,
  text: () => ["You look at the pot that's bubbling on the wood-powered stove. You can't really tell what this delicacy is, but it smells earthy and light.", 
  "You reflect on your historical food classes in grad school. Is this a 'stew'? 'mash'? 'ice cream'? As much as you want to taste it to find out, you should probably wait for it to be cooked and served."
],
  next: () => nodeStore.set(kitchenOptions)
}

const readChalkboard: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "reading the chalkboard.", roomFlags: { kitchen: { chalkBoard: true }} }),
  backgroundUrl: backgrounds.chalkBoard,
  text: () => ["You look at the chalkboard that's next to the dining room door. The Admiral's written a shopping list - cheese, vegetables, wine. There's also a list of all the guests here tonight. You wonder why."],
  next: () => nodeStore.set(kitchenOptions)
}

const addHerbs: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "adding something to the food.", weapon: "nothing", suspicious: true }),
  backgroundUrl: backgrounds.cooking,
  text: () => ["You add the herbs you took from upstairs to the pot. Maybe it will taste better now. You don't know. You don't know what those herbs were."],
  next: () => nodeStore.set(kitchenOptions)
}

const addPoison: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "adding something to the food.", weapon: "nothing", suspicious: true }),
  backgroundUrl: backgrounds.cooking,
  sounds: [{ filePath: "effects/explore/dining/pour", delay: 0.5 }],
  text: () => ["You add the arsenic to the pot.", "On reflection, you're not really hungry any more."],
  next: () => nodeStore.set(kitchenOptions)
}

const addRatPoison: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "adding something to the food.", weapon: "nothing", suspicious: true }),
  backgroundUrl: backgrounds.cooking,
  text: () => ["You add the rat poison to the pot.", "On reflection, you're not really hungry any more."],
  next: () => nodeStore.set(kitchenOptions)
}

const openCupboards: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking through the cupboards.", roomFlags: { kitchen: { cupboards: true }}}),
  sounds: [{filePath: "effects/explore/kitchen/cupboards"}],
  backgroundUrl: backgrounds.cupboards,
  text: () => ["You look in the kitchen cupboards. Among plates, wine glasses, and an assortment of cakes, you find some biscuits!"],
  next: () => nodeStore.set(kitchenOptions)
}

const dogTreat: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking something out of the pantry.", weapon: "dogTreat", suspicious: true }),
  sounds: [{filePath: "explore/dining/pickup"}],
  backgroundUrl: backgrounds.dogTreat,
  text: () => ["You take a dog treat from the pantry. You wonder if Goldie's around anywhere near..."],
  next: () => nodeStore.set(kitchenOptions)
}

const eatBiscuit: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking something out of the cupboards.", suspicious: true }),
  backgroundUrl: backgrounds.cupboards,
  sounds: [{ filePath: "effects/explore/kitchen/eat", volume: 0.5, delay: 0.5 }],
  text: () => ["You take a biscuit out of the cupboard and eat it.", "That buttery taste, that soft but not underbaked texture... it was pretty good."],
  next: () => nodeStore.set(kitchenOptions)
}

const stealRecipe: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "reading the recipe for the food.", roomFlags: { kitchen: { stolenRecipe: true }}}),
  backgroundUrl: backgrounds.recipe,
  text: () => ["You spot a recipe book next to the cooking pot with a page marked. Turns out the food is a stew! You look over the recipe and memorise it - you're certain you can recreate it at home if it turns out tasting nice!"],
  next: () => nodeStore.set(kitchenOptions)
}

const addSalt: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "adding something to the food.", suspicious: true }),
  backgroundUrl: backgrounds.cooking,
  text: () => ["You take a salt grinder and add salt to the food. You just know it needs it."],
  next: () => nodeStore.set(kitchenOptions)
}

const explorePantry: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "in the pantry.", roomFlags: { kitchen: { pantry: true }}}),
  backgroundUrl: backgrounds.pantry,
  text: () => ["You open the door and look into the pantry.", "It contains food for humans and dogs, and methods of cleaning up the leftover food that humans and dogs eat."],
  next: () => nodeStore.set(kitchenOptions)
}
