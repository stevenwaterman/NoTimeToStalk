import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { confirmWeapon, isHoldingWeapon, isHostHere } from "./explore";
import { getGlobalOptions } from "./global";
import { landingStart } from "./landing";
import { nodeStore, updateState } from "../state";

export type SecondBedroomFlags = {
  lookAround: boolean;
  cobwebs: boolean;
  picture: boolean;
  textbook: boolean;
  toyBox: boolean;
  artwork: boolean;
  dollsHouse: boolean;
  diary: boolean;
  wardrobe: boolean;
};

const backgrounds = makeBackgrounds("secondBedroom", [
  "wide",
  "wide1",
  "wide2",
  "wide3",
  "doll",
  "toyBox",
  "fireTrucks",
  "artwork",
  "schoolTextbook",
  "picture",
  "cobwebs",
  "dollsHouse",
  "diary",
  "wardrobe"
])

export const secondBedroomStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "entering the second bedroom.", location: "secondBedroom" }),
  backgroundUrl: backgrounds.wide,
  text: () => ["You are in the second bedroom."],
  next: () => nodeStore.set(secondBedroomOptions)
}

const secondBedroomOptions: OptionNode = {
  type: "OPTION",
  onEnter: updateState({ action: "not doing much." }),
  prompt: "What do you want to do?",
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.secondBedroom.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround1)
    },
    {
      visible: state => state.explore.roomFlags.secondBedroom.lookAround && !state.explore.roomFlags.secondBedroom.artwork,
      text: "Look at the artwork",
      next: () => nodeStore.set(artwork)
    },
    {
      visible: state => state.explore.roomFlags.secondBedroom.lookAround && !state.explore.roomFlags.secondBedroom.cobwebs,
      text: "Look at the cobwebs",
      next: () => nodeStore.set(cobwebs)
    },
    {
      visible: state => state.explore.roomFlags.secondBedroom.lookAround && !state.explore.roomFlags.secondBedroom.wardrobe,
      text: "Look at the wardrobe",
      next: () => nodeStore.set(wardrobe)
    },
    {
      visible: state => state.explore.roomFlags.secondBedroom.lookAround && !state.explore.roomFlags.secondBedroom.picture,
      text: "Look at the small picture",
      next: () => nodeStore.set(picture)
    },
    {
      visible: state => state.explore.roomFlags.secondBedroom.lookAround && !state.explore.roomFlags.secondBedroom.toyBox,
      text: "Look in the toy box",
      next: () => nodeStore.set(toyBox)
    },
    {
      visible: state => state.explore.roomFlags.secondBedroom.lookAround && !state.explore.roomFlags.secondBedroom.dollsHouse,
      text: "Look at the doll's house",
      next: () => nodeStore.set(dollsHouse)
    },
    {
      visible: state => state.explore.roomFlags.secondBedroom.lookAround && !state.explore.roomFlags.secondBedroom.textbook,
      text: "Read the school textbook",
      next: () => nodeStore.set(textbook)
    },
    {
      visible: state => state.explore.roomFlags.secondBedroom.lookAround && state.explore.roomFlags.secondBedroom.toyBox,
      text: "Play with the fire trucks",
      next: () => nodeStore.set(fireTrucks)
    },
    ...getGlobalOptions(() => secondBedroomOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.secondBedroom.lookAround && !state.explore.roomFlags.secondBedroom.diary,
      text: "Read the diary",
      next: () => nodeStore.set(diary),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.secondBedroom.lookAround && state.explore.roomFlags.secondBedroom.dollsHouse && !isHoldingWeapon(state, "doll"),
      text: "Take the voodoo doll",
      next: state => confirmWeapon(state, secondBedroomOptions, takeDoll),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go back to the landing",
      next: () => nodeStore.set(landingStart)
    },
  ]
}

const lookAround1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "having a look around.", roomFlags: { secondBedroom: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide1,
  text: () => ["You have a look around the bedroom. It's definitely a children's room, but looks to have been abandoned for many years."],
  next: () => nodeStore.set(lookAround2)
}

const lookAround2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide2,
  text: () => ["Even with all of the cracks and cobwebs, and the knowledge that there's no kids, the beds are made and toys laid out - it feels eerily manufactured."],
  next: () => nodeStore.set(lookAround3)
}

const lookAround3: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide3,
  text: () => ["It would have been a great room for two children to play around and do their school work. A shame that it's empty now."],
  next: () => nodeStore.set(secondBedroomOptions)
}

const cobwebs: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking around at all the cobwebs.", roomFlags: { secondBedroom: { cobwebs: true }}}),
  backgroundUrl: backgrounds.cobwebs,
  text: () => ["You look at the cobwebs in the corner of the room. Clearly some parts of this room have been forgotten."],
  next: () => nodeStore.set(secondBedroomOptions)
}

const picture: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking at the small picture.", roomFlags: { secondBedroom: { picture: true }}}),
  backgroundUrl: backgrounds.picture,
  text: () => ["You look at the small picture on the bedside table. There's a pendant and a photograph of a woman. You begin to debate on who this woman could be. The children's mother, or grandmother? An aunt? You begin to debate whether the children are even real, too. It hurts your head a little."],
  next: () => nodeStore.set(secondBedroomOptions)
}

const textbook: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "reading the school textbook.", roomFlags: { secondBedroom: { textbook: true }}}),
  backgroundUrl: backgrounds.schoolTextbook,
  sounds: [{ filePath: "effects/explore/secondBedroom/pageTurn", delay: 1, volume: 0.6 }],
  text: () => ["You read the school textbook. There's some incomprehensible scrawlings in there, and you think it may be some math?"],
  next: () => nodeStore.set(secondBedroomOptions)
}

const dollsHouse: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking in the doll's house.", roomFlags: { secondBedroom: { dollsHouse: true }}}),
  backgroundUrl: backgrounds.dollsHouse,
  text: () => [
    "You look at the doll's house. The interior of the home isn't hugely dissimilar from the manor house you've been walking around all evening.", 
    "One major difference is the creepy-looking doll in one of the rooms. You don't remember seeing that in the real manor."
  ],
  next: () => nodeStore.set(secondBedroomOptions)
}

const wardrobe: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the wardrobe.", roomFlags: { secondBedroom: { wardrobe: true }}}),
  backgroundUrl: backgrounds.wardrobe,
  text: () => ["You look in the wardrobe. It's completely empty. Weird."],
  next: () => nodeStore.set(secondBedroomOptions)
}

const diary: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "reading what looks like a child's diary.", suspicious: true, roomFlags: { secondBedroom: { diary: true }}}),
  backgroundUrl: backgrounds.diary,
  sounds: [{ filePath: "effects/explore/secondBedroom/pageTurn", delay: 1, volume: 0.6 }],
  text: () => ["You read the children's diary on the bedside table.", 
  "The pages are filled with messy script - you can only decipher the words 'food' and 'gargantuan' on the first page. It doesn't give you much insight."
],
  next: () => nodeStore.set(secondBedroomOptions)
}

const artwork: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the artwork.", roomFlags: { secondBedroom: { artwork: true }}}),
  backgroundUrl: backgrounds.artwork,
  text: () => ["You admire the artwork that's been left in the corner of the room. There is an abundance of canvas, with various landscapes started but not finished. Perhaps this is where the Admiral stores the art he wants to improve."],
  next: () => nodeStore.set(secondBedroomOptions)
}

const toyBox: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking through the toybox.", roomFlags: { secondBedroom: { toyBox: true }}}),
  backgroundUrl: backgrounds.toyBox,
  sounds: [{ filePath: "effects/explore/secondBedroom/openChest", delay: 1 }],
  text: () => ["You take a look through the toy box. Among a mess of broken toys and fluff, there are some toy fire trucks."],
  next: () => nodeStore.set(secondBedroomOptions)
}

const fireTrucks: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "playing with a toy fire truck.", suspicious: true }),
  backgroundUrl: backgrounds.fireTrucks,
  sounds: [{ filePath: "effects/explore/secondBedroom/toyCar", delay: 0.5 }],
  text: () => ["You play with the fire trucks. It gives you an immense sense of wellbeing, a throwback to your younger, more at ease self."],
  next: () => nodeStore.set(secondBedroomOptions)
}

const takeDoll: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking something out of the doll's house.", weapon: "doll", suspicious: true }),
  backgroundUrl: backgrounds.doll,
  sounds: [{filePath: "explore/dining/pickup"}],
  text: () => ["You take the voodoo doll out of the dolls house. What's the worst that could happen?"],
  next: () => nodeStore.set(secondBedroomOptions)
}
