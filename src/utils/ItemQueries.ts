import { Player, Location, Mobile, Fixed, Person } from "../content/Constants";
import { inCsv } from "./Utils";

/**
 * Return the player's current location
 * @param items: The current world
 * @returns
 */
export function getLocation(items: Array<Item>): Item | undefined {
  let player = getPlayer(items);
  return items.find((i) => {
    return (
      i.Type.toLowerCase() === Location.toLowerCase() &&
      i.Location.toLowerCase() === player?.Location.toLowerCase()
    );
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
      (i.Type.toLowerCase() === Location.toLowerCase() &&
        i.Name.toLowerCase() === location?.Name.toLowerCase()) ||
      ((i.Type.toLowerCase() === Mobile || i.Type.toLowerCase() === Fixed) &&
        (i.Location.toLowerCase() === location?.Name.toLowerCase() ||
          i.Location.toLowerCase() === Player))
  );
}

/**
 * returns all items that the user can interact with,
 * mobile or fixed in the current location or player inventory
 * To allow user to examine or invoke custom verbs
 * @param items
 */
export function getAccessibleItems(items: Array<Item>): Array<Item> {
  let location = getLocation(items);
  return items.filter((i) => {
    return (
      (i.Type.toLowerCase() === Mobile ||
        i.Type.toLowerCase() === Fixed ||
        i.Type.toLowerCase() === Person) &&
      (i.Location.toLowerCase() === location?.Name.toLowerCase() ||
        i.Location.toLowerCase() === Player)
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
      (i.Type.toLowerCase() === Mobile ||
        i.Type.toLowerCase() === Fixed ||
        i.Type.toLowerCase() === Person)
  );
}

export function getCarriedItems(items: Array<Item>): Array<Item> {
  return items.filter((i) => {
    return i.Location === Player;
  });
}

/**
 * Returns the request item is it is gettable
 * i.e. if it is mobile and in the current location
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
      i.Name.toLowerCase() === name.toLowerCase() &&
      i.Location.toLowerCase() === location?.Name.toLowerCase() &&
      i.Type === Mobile
    );
  });
}

/**
 * Returns all items that the user can get
 * @param items: The current world
 * @param alias
 * @returns
 */
export function getGettableItems(
  items: Array<Item>,
  alias: string
): Array<Item> {
  let location = getLocation(items);
  return items.filter((i) => {
    return (
      inCsv(i.Name, alias) &&
      i.Location.toLowerCase() === location?.Name.toLowerCase() &&
      i.Type === Mobile
    );
  });
}

/**
 * Returns the unique items that the user can drop
 * @param items: The current world
 * @param name
 * @returns
 */
export function getDropableItem(
  items: Array<Item>,
  name: string
): Item | undefined {
  return items.find(
    (i) =>
      i.Name.toLowerCase() === name.toLowerCase() &&
      i.Location.toLowerCase() === Player
  );
}

/**
 * Returns all items that the user can drop
 * based on the non-unqiue alias provided
 * @param items: The current world
 * @param alias
 * @returns
 */
export function getDropableItems(
  items: Array<Item>,
  alias: string
): Array<Item> {
  return items.filter(
    (i) => inCsv(i.Name, alias) && i.Location.toLowerCase() === Player
  );
}

/**
 * Return a specific item by exact name (not alias))
 * @param items: The current world
 * @param name
 * @returns
 */
export function getItemByName(
  items: Array<Item>,
  name: string
): Item | undefined {
  return items.find((i) => inCsv(i.Name, name));
}

/**
 * Return all items that match the alias
 * Item aliases can be truncations of long names, such as
 * english homework becomes homework, which may or may not
 * be unique in the current locations
 * @param items: The current world
 * @param alias the alias to match items against
 * @returns
 */
export function getItemsByName(items: Array<Item>, alias: string): Array<Item> {
  return items.filter((i) => {
    return inCsv(i.Name, alias);
  });
}

export function getPlayer(items: Array<Item>): Item | undefined {
  return items.find((i) => i.Type.toLowerCase() === Player);
}
