import { Moves, Person } from "../content/Constants";
import { getCarriedItems, getVisibleItems } from "./ItemQueries";

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
  return `Exits: ${capitalizeFirstLetter(exitList)}.`;
}

export function getInventory(items: Array<Item>): string {
  let inv = getCarriedItems(items);
  let carrying =
    inv.length === 0
      ? "nothing"
      : inv
          .map(
            (i) =>
              `${i.Prefix === undefined ? "" : i.Prefix} ${
                i.Name.split(",")[0]
              }`
          )
          .join(", ");
  const lastCommaIndex = carrying.lastIndexOf(",");
  if (lastCommaIndex !== -1) {
    carrying = `${carrying.substring(
      0,
      lastCommaIndex
    )} and${carrying.substring(lastCommaIndex + 1)}`;
  }
  return `You are carrying ${carrying}.`;
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeEveryWord(sentence: string): string {
  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
    description = `${capitalizeFirstLetter(location?.Name)}: ${
      location?.Description
    }${okString(location?.State) ? ` ${location?.State}` : ""}`;
  } else {
    description = `${capitalizeFirstLetter(location?.Name)}.`;
  }
  return description;
}

export function getView(items: Array<Item>): string {
  let local = getVisibleItems(items);
  if (local.length === 0) {
    return "";
  }

  let view = local
    .map(
      (i) =>
        `${i.Prefix === undefined ? "" : i.Prefix} ${
          i.Type === Person ? capitalizeEveryWord(i.Name) : i.Name.split(",")[0]
        }`
    )
    .join(", ");
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

export function isVersionLessThan(
  v1: string | undefined,
  v2: string | undefined
): boolean {
  if (v1 === undefined || v2 === undefined) {
    return false;
  }
  const parts1 = v1.replace("V", "").split(".").map(Number);
  const parts2 = v2.replace("V", "").split(".").map(Number);

  for (let i = 0; i < parts1.length; i++) {
    if (parts1[i] < parts2[i]) {
      return true;
    } else if (parts1[i] > parts2[i]) {
      return false;
    }
  }

  return false;
}

export function inCsv(csv: string, str: string): boolean {
  if (!okString(csv)) return false;
  if (!okString(str)) return false;
  const values = csv.toLowerCase().split(",");
  return values.includes(str.trim().toLowerCase());
}

export function okObject(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

export function okString(obj: any): boolean {
  return obj !== undefined && obj !== null && obj !== "";
}

export function primaryAlias(item: Item): string {
  return item.Name?.split(",")[0];
}
