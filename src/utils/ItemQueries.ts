import { Player, Location, Mobile, Fixed } from "../content/Constants";

export function getLocation(items: Array<Item>): Item | undefined {
  let player = getPlayer(items);
  return items.find((i) => {
    return i.Type === Location && i.Location === player?.Location;
  });
}

export function getLocalItems(
  items: Array<Item>,
  location: string
): Array<Item> {
  return items.filter(
    (i) =>
      (i.Location === location || i.Location === Player) &&
      (i.Type === Mobile || i.Type === Fixed)
  );
}

export function getVisibleItems(
  items: Array<Item>,
  location: string
): Array<Item> {
  return items.filter(
    (i) => i.Location === location && (i.Type === Mobile || i.Type === Fixed)
  );
}

export function getGettableItem(
  items: Array<Item>,
  name: string
): Item | undefined {
  let location = getLocation(items);
  return items.find((i) => {
    return (
      i.Name === name && i.Location === location?.Name && i.Type === Mobile
    );
  });
}

export function getItemByName(
  items: Array<Item>,
  name: string
): Item | undefined {
  return items.find((i) => i.Name?.toLowerCase() === name.toLowerCase());
}

export function getPlayer(items: Array<Item>): Item | undefined {
  return items.find((i) => i.Type === Player);
}

export function getDropableItem(
  items: Array<Item>,
  name: string
): Item | undefined {
  return items.find((i) => i.Name === name && i.Location === Player);
}
