import { Player } from "../content/Constants";
import { Moves } from "../content/Moves";

export function Exits(location: Item): string {
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
  return `Exits: ${capitalizeFirstLetter(exitList)}`;
}

export function Inventory(items: Array<Item>): string {
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

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getRandomElement(arr: any[]): any {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
