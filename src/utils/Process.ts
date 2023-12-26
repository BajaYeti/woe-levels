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
    let item = items.find(
      (i) => i.Name.toLowerCase() === u.TargetItem.toLowerCase()
    );
    if (item === null || item === undefined) {
      return;
    }
    switch (u.Property) {
      case "state":
        item.State = u.Value;
        break;
      default: //location is default property to update
        item.Location = u.Value;
        break;
    }
  });
  return updatedItems;
}
