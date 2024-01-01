import { Mobile, Player, Moves } from "../content/Constants";
import { getLocation, getPlayer } from "./ItemQueries";

export function getExits(location: Item | undefined): string {
  if (location === undefined) {
    return "";
  }
  if (location.Actions === null || location.Actions === undefined) {
    return "";
  }
  let exits = location.Actions.filter((a) =>
    Moves.includes(a.Verb.toLowerCase())
  );
  let exitList = exits.map((x) => x.Verb).join(", ");
  const lastCommaIndex = exitList?.lastIndexOf(",");
  if (lastCommaIndex !== -1) {
    exitList = `${exitList?.substring(
      0,
      lastCommaIndex
    )} and${exitList?.substring(lastCommaIndex + 1)}`;
  }
  return `Exits: ${getFirstLetterCaps(exitList)}`;
}

export function getInventory(items: Array<Item>): string {
  let inv = items.filter((i) => {
    return i.Location === Player;
  });
  let carrying =
    inv.length === 0
      ? "nothing"
      : inv.map((i) => `${i.Prefix} ${i.Name}`).join(", ");
  const lastCommaIndex = carrying.lastIndexOf(",");
  if (lastCommaIndex !== -1) {
    carrying = `${carrying.substring(
      0,
      lastCommaIndex
    )} and${carrying.substring(lastCommaIndex + 1)}`;
  }
  return `You are carrying ${carrying}`;
}

export function getFirstLetterCaps(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getRandomElement(arr: any[]): any {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function getLocationDescription(
  location: Item | undefined,
  brevity: boolean
): string {
  let description = "";
  if (location === undefined) {
    return description;
  }
  if (
    location.Count === undefined ||
    Number.isNaN(location.Count) ||
    location.Count === 0 ||
    !brevity
  ) {
    description = `${getFirstLetterCaps(location?.Name)}: ${
      location?.Description
    }`;
  } else {
    description = `${getFirstLetterCaps(location?.Name)}.`;
  }
  return description;
}

export function getView(items: Array<Item>): string {
  let player = getPlayer(items);
  let location = getLocation(items);
  if (location === null && location === undefined) {
    return "You cannot see where you are.";
  }
  let local = items.filter(
    (i) => i.Location === location?.Name && i.Type === Mobile
  );
  if (local.length === 0) {
    return "";
  }
  let view = local.map((i) => `${i.Prefix} ${i.Name}`).join(", ");
  const lastCommaIndex = view.lastIndexOf(",");
  if (lastCommaIndex !== -1) {
    view = `${view.substring(0, lastCommaIndex)} and${view.substring(
      lastCommaIndex + 1
    )}`;
  }

  return `You can see ${view}.`;
}

export function saveToLocalStorage(key: string, data: any): string {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return "Save OK. To continue at a later date using this save, type 'load'";
  } catch (error) {
    return `Error saving to localStorage: ${error}`;
  }
}

export function loadFromLocalStorage(key: string): any {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return undefined;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    return undefined;
  }
}
