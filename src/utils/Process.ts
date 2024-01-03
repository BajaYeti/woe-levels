import { FrontStreet, Player } from "../content/Constants";
import { getItemByName } from "./ItemQueries";

/**
 * Process a user parsed and checked action
 * @param request: An action to be processed
 * @param items: An array of items to be updated
 * @returns items: An array of updated
 */
export function Process(request: Action, items: Array<Item>): Process {
  if (request.Updates === null || request.Updates === undefined) {
    return { Feedback: null, Items: items };
  }

  let updatedItems: Array<Item> = items;
  let Feedback = Array<string>();
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
              Feedback.push(
                `You try to move to "${item.Location}, but you pass out and wake up in a different location."`
              );
              item.Location = FrontStreet;
            }
          }
          break;
      }
    }
  });
  return { Feedback: Feedback.join(". "), Items: updatedItems };
}
