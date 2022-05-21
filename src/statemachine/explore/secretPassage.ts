import { makeBackgrounds, MonologueNode, OptionNode } from "../controller";
import { confirmWeapon, isHoldingWeapon, isHostHere } from "./explore";
import { getGlobalOptions } from "./global";
import { loungeSecretStart } from "./lounge";
import { masterBedroomSecretStart } from "./masterBedroom";
import { nodeStore, updateState } from "../state";

export type SecretPassageFlags = {
  lookAround: boolean;
  gnomes: boolean;
};

const backgrounds = makeBackgrounds("secretPassage", [
  "wide",
  "wide1",
  "wide2",
  "upperEntrance",
  "lowerEntrance",
  "gnomes1",
  "gnomes2",
  "gnomes3",
  "gnomes4",
  "gnomes5",
  "gnomes6",
  "gnomes7",
  "gnomes8",
  "gnomes9",
  "gnomes10",
  "gnomes11",
  "gnomes12",
  "scythe"
])

export const secretPassageStartLower: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "entering the secret passage from the lounge.", location: "secretPassage" }),
  backgroundUrl: backgrounds.lowerEntrance,
  text: () => ["You enter the secret passage through the bookcase and head up the stairs."],
  next: () => nodeStore.set(secretPassageOptions)
}

export const secretPassageStartUpper: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "entering the secret passage from the master bedroom.", location: "secretPassage" }),
  backgroundUrl: backgrounds.upperEntrance,
  text: () => ["You enter the secret passage through the wardrobe."],
  next: () => nodeStore.set(secretPassageOptions)
}

const secretPassageOptions: OptionNode = {
  type: "OPTION",
  onEnter: updateState({ action: "not doing much." }),
  prompt: "What do you want to do?",
  backgroundUrl: backgrounds.wide,
  options: [
    {
      visible: state => !state.explore.roomFlags.secretPassage.lookAround,
      text: "Look around",
      next: () => nodeStore.set(lookAround1)
    },
    {
      visible: state => state.explore.roomFlags.secretPassage.lookAround && !state.explore.roomFlags.secretPassage.gnomes,
      text: "Look at all the gnomes",
      next: () => nodeStore.set(lookAtGnomes1)
    },
    ...getGlobalOptions(() => secretPassageOptions, backgrounds.wide),
    {
      visible: state => state.explore.roomFlags.secretPassage.lookAround && state.explore.roomFlags.secretPassage.gnomes && !isHoldingWeapon(state, "scythe"),
      text: "Take the scythe",
      next: state => confirmWeapon(state, secretPassageOptions, takeScythe),
      disabledReasons: [{ disabled: isHostHere, reason: "You can't do that now, The Admiral will see you..." }]
    },
    {
      text: "Go into the lounge",
      next: () => nodeStore.set(loungeSecretStart)
    },
    {
      text: "Go into the master bedroom",
      next: () => nodeStore.set(masterBedroomSecretStart)
    },
  ]
}

const lookAround1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "not doing much.", roomFlags: { secretPassage: { lookAround: true }}}),
  backgroundUrl: backgrounds.wide,
  text: () => ["...You look, but you can't really fathom what on earth is going on in this room. There seems to just be a LOT of gnomes."],
  next: () => nodeStore.set(lookAround2)
}

const lookAround2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.wide2,
  text: () => ["At least there's a way out, even if it does look incredibly grim and slightly threatening."],
  next: () => nodeStore.set(secretPassageOptions)
}

const lookAtGnomes1: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "looking at the gnomes.", roomFlags: { secretPassage: { gnomes: true }}}),
  backgroundUrl: backgrounds.gnomes1,
  text: () => ["While you're here, you may as well have a look at all of these little fellas.", 
  "You name this one Par-Tea. He looks like he's having a better time at this party than you are, at least."],
  next: () => nodeStore.set(lookAtGnomes2)
}

const lookAtGnomes2: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.gnomes2,
  text: () => ["Along from that is a green gnome that you see as a 'Gus'. His moustache is impeccable - you wonder how much of the Admiral's hair cream he stole."],
  next: () => nodeStore.set(lookAtGnomes3)
}

const lookAtGnomes3: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.gnomes3,
  text: () => ["This one has big 'Terry' energy. Look at that little shy boy. No doubt he's hiding a dark secret."],
  next: () => nodeStore.set(lookAtGnomes4)
}

const lookAtGnomes4: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.gnomes4,
  text: () => ["Beside him is this happy little gnome you fondly call 'Harold'. He has a lovely playful energy that honestly gives you slight respite from the unsettling energy of this room."],
  next: () => nodeStore.set(lookAtGnomes5)
}

const lookAtGnomes5: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.gnomes5,
  text: () => ["...This one doesn't feel safe to be looking at while working. You name him 'Gareth' and continue on before you make too much awkward eye contact."],
  next: () => nodeStore.set(lookAtGnomes6)
}

const lookAtGnomes6: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.gnomes6,
  text: () => ["This gnome feels like how you felt as you came in this room. You name him 'Soil', partly due to his garden origins, and partly because he looks like he's soiled his pants."],
  next: () => nodeStore.set(lookAtGnomes7)
}

const lookAtGnomes7: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.gnomes7,
  text: () => ["You can't tell whether you find this gnome cute or not, to be honest, but you have a wave of intrigue of whether the bear fur is soft or not. It isn't. You call them 'Beary Mary'."],
  next: () => nodeStore.set(lookAtGnomes8)
}

const lookAtGnomes8: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.gnomes8,
  text: () => ["This gnome immediately feels like a 'Gerry'. He's ready for work, selling his soul to the market while you slowly lose the sanity of yours lingering in this room."],
  next: () => nodeStore.set(lookAtGnomes9)
}

const lookAtGnomes9: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.gnomes9,
  text: () => ["The bright pink bunny gnome takes you by surprise a bit, because it somehow still looks cute while also looking deeply into the depths of your being. You call him 'Alexander'."],
  next: () => nodeStore.set(lookAtGnomes10)
}

const lookAtGnomes10: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.gnomes10,
  text: () => ["This poor gnome got off the wrong stop on the way to the pool. You feel sad for them, and give a little pat on the head. You instantly regret your action and apologise to the gnome you've called 'Ring'. As you should, because that's a terrible name."],
  next: () => nodeStore.set(lookAtGnomes11)
}

const lookAtGnomes11: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.gnomes11,
  text: () => ["It's a g-nome. Boo. You assume this ghost is called Thomas but are WAY too frightened to ask."],
  next: () => nodeStore.set(lookAtGnomes12)
}

const lookAtGnomes12: MonologueNode = {
  type: "MONOLOGUE",
  backgroundUrl: backgrounds.gnomes12,
  text: () => [
    "You notice one gnome is larger than the rest, holding a scythe. This is where you die, you think.",
    "Dying in the past wouldn't kill you in the future, but that doesn't mean it sounds fun.",
    "You take a deep breath and name this gnome 'Dennis'."
  ],
  next: () => nodeStore.set(secretPassageOptions)
}

const takeScythe: MonologueNode = {
  type: "MONOLOGUE",
  onEnter: updateState({ action: "taking a scythe off a gnome.", weapon: "scythe", suspicious: true }),
  backgroundUrl: backgrounds.scythe,
  sounds: [{ filePath: "effects/explore/kitchen/knife", delay: 0.5 }],
  text: () => ["You take Dennis the gnome's scythe. You really hope he's ok with that."],
  next: () => nodeStore.set(secretPassageOptions)
}

