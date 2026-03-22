const ADJECTIVES = [
  "Silent",
  "Cunning",
  "Shadow",
  "Velvet",
  "Phantom",
  "Slick",
  "Daring",
  "Rogue",
  "Stealthy",
  "Nimble",
  "Clever",
  "Swift",
  "Ghostly",
  "Sly",
  "Bold",
  "Covert",
  "Wily",
  "Keen",
  "Shrewd",
  "Cryptic",
]

const NOUNS = [
  "Fox",
  "Raven",
  "Panther",
  "Viper",
  "Falcon",
  "Jackal",
  "Cobra",
  "Lynx",
  "Hawk",
  "Wolf",
  "Otter",
  "Badger",
  "Owl",
  "Heron",
  "Crane",
  "Mink",
  "Ferret",
  "Puma",
  "Osprey",
  "Mantis",
]

const VERBS = [
  "Dashes",
  "Prowls",
  "Vanishes",
  "Strikes",
  "Lurks",
  "Bolts",
  "Glides",
  "Creeps",
  "Swoops",
  "Slinks",
  "Pounces",
  "Darts",
  "Sneaks",
  "Leaps",
  "Dodges",
  "Weaves",
  "Stalks",
  "Vaults",
  "Sprints",
  "Escapes",
]

function pickRandom(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)]
}

export function generateCodename(): string {
  return pickRandom(ADJECTIVES) + pickRandom(NOUNS) + pickRandom(VERBS)
}
