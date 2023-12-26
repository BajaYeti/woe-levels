import { Player } from "../content/Constants";

export function getLocalItems(
  items: Array<Item>,
  location: string
): Array<Item> {
  return items.filter((i) => i.Location === location || i.Location === Player);
}
