import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { atriumStart } from "./atrium";
import { confirmWeapon, gardenCharacters, isHoldingWeapon, isHostHere } from "./explore";
import { gardenStartStudy } from "./garden";
import { getGlobalOptions } from "./global";
import { nodeStore, updateState } from "../state";

export type StudyFlags = {
  lookAround: boolean;
  desk: boolean;
  globe: boolean;
  paperwork: boolean;
  painting: boolean;
  chess: boolean;
  blunder: boolean;
  art: boolean;
};

const backgrounds = makeBackgrounds("study", [
  "wide",
  "wide1",
  "wide2",
  "wide3",
  "lute",
  "chess",
  "sword",
  "painting",
  "window",
  "desk",
  "globe",
  "paperwork",
  "reading",
  "art1",
  "art2",
  "art3"
])

export const studyStart: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "entering the study.", location: "study" }),
  backgroundUrl: backgrounds.wide,
  text: () => ["You are in the study."],
  next: () => nodeStore.set(studyOptions)
}

const studyOptions: OptionNode = {
  type: "OPTION",
  onEnter: updateState({ action: "not doing much." }),
  prompt: "What do you want to do?",
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.study.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround1)
    },
    {
      visible: state => state.explore.roomFlags.study.lookAround && !state.explore.roomFlags.study.art,
      text: "Admire the art",
      next: () => nodeStore.set(admireArt1)
    },
    {
      visible: state => state.explore.roomFlags.study.lookAround,
      text: "Sit and read",
      next: () => nodeStore.set(sitAndRead)
    },
    {
      visible: state => state.explore.roomFlags.study.lookAround && !state.explore.roomFlags.study.globe,
      text: "Admire the globe",
      next: () => nodeStore.set(admireGlobe)
    },
    {
      visible: state => state.explore.roomFlags.study.lookAround && !state.explore.roomFlags.study.chess,
      text: "Look at the chess board",
      next: () => nodeStore.set(lookAtChess)
    },
    {
      visible: state => state.explore.roomFlags.study.lookAround,
      text: "Look out the window",
      next: () => nodeStore.set(lookOutWindow)
    },
    {
      visible: state => state.explore.roomFlags.study.lookAround && !isHoldingWeapon(state, "lute"),
      text: "Pick up a lute",
      next: () => nodeStore.set(pickUpLute)
    },
    {
      visible: state => state.explore.roomFlags.study.lookAround && !state.explore.roomFlags.study.desk,
      text: "Inspect the desk",
      next: () => nodeStore.set(inspectDesk)
    },
    ...getGlobalOptions(() => studyOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.study.lookAround && state.explore.roomFlags.study.chess && !state.explore.roomFlags.study.blunder,
      text: "Make a chess move",
      next: () => nodeStore.set(chessMove),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.study.lookAround && !state.explore.roomFlags.study.painting,
      text: "Add to the painting",
      next: () => nodeStore.set(painting),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.study.lookAround && !state.explore.roomFlags.study.paperwork,
      text: "Look through paperwork",
      next: () => nodeStore.set(paperwork),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.study.lookAround && !isHoldingWeapon(state, "sword"),
      text: "Take a sword",
      next: state => confirmWeapon(state, studyOptions, takeSword),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      visible: state => state.explore.roomFlags.study.lookAround,
      text: "Climb through the broken window",
      next: () => nodeStore.set(climbThroughWindow),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go into the atrium",
      next: () => nodeStore.set(atriumStart)
    },
  ]
}

const lookAround1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "having a look around.", roomFlags: { study: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide1,
  text: () => ["You have a look around the study. The decor in this room gives off focused, productive energies."],
  next: () => nodeStore.set(lookAround2)
}

const lookAround2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide2,
  text: () => ["You get more insight into some of the Admiral's hobbies in this room, with painting and writing equipment sprawled everywhere."],
  next: () => nodeStore.set(lookAround3)
}

const lookAround3: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide3,
  text: () => ["However, the illusion of productive bliss fades when you feel the gust of wind coming from the broken window."],
  next: () => nodeStore.set(studyOptions)
}

const climbThroughWindow: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "climbing through the broken window.", suspicious: true, buffs: { injured: true }}),
  backgroundUrl: backgrounds.window,
  sounds: [{ filePath: "effects/explore/study/glass", delay: 0.5 }],
  text: () => [
    "You climb through the broken window into the garden. The jagged glass cuts your hands as you stumble through.", 
    "You are visibly injured."
  ],
  next: () => nodeStore.set(gardenStartStudy)
}

const lookOutWindow: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking out the window." }),
  backgroundUrl: backgrounds.window,
  text: state => ["You look out of the broken window into the garden.", ...gardenCharacters(state)],
  next: () => nodeStore.set(studyOptions)
}

const sitAndRead: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "reading a book." }),
  backgroundUrl: backgrounds.reading,
  sounds: [{ filePath: "effects/explore/secondBedroom/pageTurn", delay: 2, volume: 0.6 },
    {filePath: "effects/explore/atrium/sit", volume: 0.4}],
  text: () => ["You sit down on the sofa and take a moment to read one of the available books.",
  "You decide to have a flick through 'The Trials and Tribulations of Thomas Thorn', which happened to be a murder mystery drama. How meta."],
  next: () => nodeStore.set(studyOptions)
}

const admireArt1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the art.", roomFlags: { study: { art: true }}}),
  backgroundUrl: backgrounds.art1,
  text: () => ["You admire the art around the office. You're unsure if these are maps of places the Admiral has been on his travels, or whether they're completely made up because it looks very unfamiliar."],
  next: () => nodeStore.set(admireArt2)
}

const admireArt2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.art2,
  text: () => ["There's also a few sketches that had been pinned to the wall of a woman. Could this be Cassandra, or someone else? It's hard to tell."],
  next: () => nodeStore.set(admireArt3)
}

const admireArt3: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.art3,
  text: () => ["There's also some paintings above the desk. Some peaceful views of the sea and a river really do give you a sense of comfort."],
  next: () => nodeStore.set(studyOptions)
}

const pickUpLute: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "picking up a lute.", weapon: "lute" }),
  backgroundUrl: backgrounds.lute,
  sounds: [{filePath: "explore/dining/pickup"}],
  text: () => ["You pick up a lute. You don't know how to play the lute."],
  next: () => nodeStore.set(studyOptions)
}

const lookAtChess: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the chess board.", roomFlags: { study: { chess: true }}}),
  backgroundUrl: backgrounds.chess,
  text: () => ["You admire the chess board. It's been a long time since you've seen a physical board. This game is even half-completed!"],
  next: () => nodeStore.set(studyOptions)
}

const chessMove: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "playing chess by themselves.", suspicious: true, roomFlags: { study: { blunder: true }}}),
  sounds: [{filePath: "effects/explore/study/chess"}],
  backgroundUrl: backgrounds.chess,
  text: () => [
    "You have never been very good at chess, but you'll give it a try.", 
    "You think for a minute, and make a great move.", 
    "You sacrificed the queen for no reason."
  ],
  next: () => nodeStore.set(studyOptions)
}

const inspectDesk: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the desk.", suspicious: true, roomFlags: { study: { desk: true }}}),
  backgroundUrl: backgrounds.desk,
  sounds: [{ filePath: "effects/explore/masterBedroom/drawer", volume: 0.4, delay: 0.5 }],
  text: () => [
    "You inspect the desk, looking at various bits of junk in the drawers.", 
    "There's nothing of interest."
  ],
  next: () => nodeStore.set(studyOptions)
}

const admireGlobe: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "admiring the globe.", roomFlags: { study: { globe: true }}}),
  backgroundUrl: backgrounds.globe,
  text: () => [
    "You admire the globe.", 
    "You give it a spin, looking for your home country of Floriskia.", 
    "It doesn't exist yet."
  ],
  next: () => nodeStore.set(studyOptions)
}

const paperwork: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking through the paperwork.", suspicious: true, roomFlags: { study: { paperwork: true }}}),
  backgroundUrl: backgrounds.paperwork,
  sounds: [{ filePath: "effects/explore/secondBedroom/pageTurn", delay: 0.5, volume: 0.6 }],
  text: () => [
    "You leaf through the paperwork, having a nosey.", 
    "It turns out that every single guest has a motive to kill the Admiral.", 
    "How convenient."
  ],
  next: () => nodeStore.set(studyOptions)
}

const painting: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "painting.", suspicious: true, buffs: { painty: true }, roomFlags: { study: { painting: true }}}),
  backgroundUrl: backgrounds.painting,
  sounds: [{filePath: "effects/explore/study/paint"}],
  text: () => [
    "You take a paintbrush and add a little something to the painting, giving it that much-needed splash of colour.", 
    "You are now covered in paint.", 
    "You also ruined the painting."
  ],
  next: () => nodeStore.set(studyOptions)
}

const takeSword: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking a sword off the wall.", weapon: "sword", suspicious: true }),
  backgroundUrl: backgrounds.sword,
  sounds: [{ filePath: "effects/explore/kitchen/knife", delay: 0.5 }],
  text: () => ["You take a longsword off the displays on the wall."],
  next: () => nodeStore.set(studyOptions)
}
