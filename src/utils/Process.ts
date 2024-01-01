import { FrontStreet, Player } from "../content/Constants";
import { getItemByName } from "./ItemQueries";

/**
 * Process a user parsed and checked action
 * @param request: An action to be processed
 * @param items: An array of items to be updated
 * @returns items: An array of updated
 */
export function Process(request: Action, items: Array<Item>): Array<Item> {
  if (request.Updates === null || request.Updates === undefined) {
    return items;
  }

  let updatedItems: Array<Item> = items;
  request.Updates.forEach((u) => {
    let item = getItemByName(items, u.TargetItem);
    if (item !== undefined) {
      switch (u.Property) {
        case "state":
          item.State = u.Value;
          break;
        default: //location is default property to update
          item.Location = u.Value;
          //if player is moving, update location counter for brevity
          if (item.Name.toLowerCase() === Player) {
            let location = getItemByName(items, item.Location);
            if (location !== undefined) {
              //update location counter
              if (
                location.Count === undefined ||
                Number.isNaN(location.Count)
              ) {
                location.Count = 0;
              } else {
                location.Count++;
              }
            } else {
              //catch breaking move and tele port back to front street
              console.log(
                `Player moved to undefined location "${item.Location}"`
              );
              item.Location = FrontStreet;
            }
          }
          break;
      }
    }
  });
  return updatedItems;
}
