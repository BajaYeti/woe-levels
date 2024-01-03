import { Player, Location, Mobile, Fixed, Person } from "../content/Constants";

/**
 * Return the player's current location
 * @param items: The current world
 * @returns
 */
export function getLocation(items: Array<Item>): Item | undefined {
  let player = getPlayer(items);
  return items.find((i) => {
    return i.Type === Location && i.Location === player?.Location;
  });
}

/**
 * Returns all items at the player's location, including the location
 * so the help content can be read from all
 * @param items: The current world
 * @returns
 */
export function getHelpItems(items: Array<Item>): Array<Item> {
  let location = getLocation(items);
  return items.filter(
    (i) =>
      //if item is a location, use the Name as the Location
      (i.Type === Location && i.Name === location?.Name) ||
      ((i.Type === Mobile || i.Type === Fixed) &&
        (i.Location === location?.Name || i.Location === Player))
  );
}

/**
 * returns all items that the user can interact with,
 * mobile or fixed in the current location or player inventory
 * @param items
 */
export function getAvailbleItem(items: Array<Item>): Array<Item> {
  let location = getLocation(items);
  return items.filter((i) => {
    return (
      (i.Type === Mobile || i.Type === Fixed) &&
      (i.Location === location?.Name || i.Location === Player)
    );
  });
}

/**
 * Returns all items that are visible to the user, to populate the view
 * @param items: The current world
 * @param location
 * @returns
 */
export function getVisibleItems(items: Array<Item>): Array<Item> {
  let location = getLocation(items);
  return items.filter(
    (i) =>
      i.Location === location?.Name &&
      (i.Type === Mobile || i.Type === Fixed || i.Type === Person)
  );
}

/**
 * Returns all items that the user can get
 * @param items: The current world
 * @param name
 * @returns
 */
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

/**
 * Returns all items that the user can drop
 * @param items: The current world
 * @param name
 * @returns
 */
export function getDropableItem(
  items: Array<Item>,
  name: string
): Item | undefined {
  return items.find((i) => i.Name === name && i.Location === Player);
}

/**
 * Return a specific item by name
 * @param items: The current world
 * @param name
 * @returns
 */
export function getItemByName(
  items: Array<Item>,
  name: string
): Item | undefined {
  return items.find((i) => i.Name?.toLowerCase() === name.toLowerCase());
}

export function getPlayer(items: Array<Item>): Item | undefined {
  return items.find((i) => i.Type === Player);
}
