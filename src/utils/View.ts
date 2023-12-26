import { Mobile, Player } from "../content/Constants";

export function View(items: Array<Item>): string {
  let player = items.find((i) => i.Name === Player);
  let location = items.find((i) => i.Name === player?.Location);
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
