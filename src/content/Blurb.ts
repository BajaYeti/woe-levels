export function About(): string {
  return "Woe Levels: A text adventure conceived and set in the 1980s, a mere 40 years in the making. Based on school life in a typical British comprehensive school, your goal is the survive the day, collect all your misplaced homework assignments, hand them all to the appropriate teachers and get home.";
}

export function Instructions(): string {
  return `Type 'verb noun' actions. Nouns are multi-word items or people, 
    each having a collection of specific verbs e.g.:|
    - get lamp|- examine lamp|- light lamp|
    Nonspecific verbs include:|
    - Move; north, northeast, east, southeast, south, southwest, west, northwest, in, out, up and down.|
    - Interact; look, inventory and help.|
    - Progress; about, instructions, save and load.`;
}
