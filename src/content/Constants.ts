export const AppVersion = "V1.0.3";
export const AppTitle = "Woe Levels";
export const AppAuthor = "BajaYeti";
export const LocalStoargeKey = "woe-levels";

export const Player = "player";
export const Location = "location";
export const Person = "person";
export const Mobile = "mobile";
export const Fixed = "fixed";
export const Carat = "-";
export const Look = "look";
export const Help = "help";
export const Get = "get";
export const Drop = "drop";
export const Inventory = "inventory";
export const About = "about";
export const Instructions = "instructions";
export const Load = "load";
export const Save = "save";
export const Examine = "examine";
export const FrontStreet = "front street";
export const Version = "version";

export const AboutResponse =
  "Woe Levels: A text adventure conceived and set in the 1980s, a mere 40 years in the making. Based on school life in a typical British comprehensive school, your goal is the survive the day, collect all your misplaced homework assignments, submit them all to the appropriate teachers and get home.";

export const InstructionsResponse = `Type 'verb noun' actions. Nouns are multi-word items or people, 
      each having a collection of specific verbs e.g.:|
      - get lamp|- examine lamp|- light lamp|
      Nonspecific verbs include:|
      - Move; north, northeast, east, southeast, south, southwest, west, northwest, in, out, up and down.|
      - Interact; look, inventory and help.|
      - Progress; about, instructions, save and load.`;

export const Moves: Array<string> = [
  "north",
  "northeast",
  "east",
  "southeast",
  "south",
  "southwest",
  "west",
  "northwest",
  "up",
  "down",
  "in",
  "out",
];

export const Truncations: Array<Truncation> = [
  { short: "n", long: "north" },
  { short: "ne", long: "northeast" },
  { short: "e", long: "east" },
  { short: "se", long: "southeast" },
  { short: "s", long: "south" },
  { short: "sw", long: "southwest" },
  { short: "w", long: "west" },
  { short: "nw", long: "northwest" },
  { short: "i", long: "in" },
  { short: "o", long: "out" },
  { short: "u", long: "up" },
  { short: "d", long: "down" },
  { short: "l", long: "look" },
  { short: "inv", long: "inventory" },
  { short: "exam", long: "examine" },
  { short: "h", long: "help" },
  { short: "ver", long: "version" },
];
