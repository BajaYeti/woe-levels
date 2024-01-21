import {
  Player,
  Location,
  Look,
  Help,
  Get,
  Inventory,
  About,
  Instructions,
  Save,
  LocalStoargeKey,
  Load,
  Examine,
  AboutResponse,
  InstructionsResponse,
  Moves,
  FrontStreet,
  Version,
  Drop,
  InventoryLimit,
  Count,
  Where,
  Go,
} from "../content/Constants";
import { Truncations } from "../content/Constants";
import {
  getItemByName,
  getHelpItems,
  getLocation,
  getPlayer,
  getAccessibleItems,
  getCarriedItems,
  getGettableItems,
  getDropableItems,
  getItemsByName,
} from "./ItemQueries";
import {
  capitalizeFirstLetter,
  getInventory,
  getRandomElement,
  inCsv,
  isVersionLessThan,
  loadFromLocalStorage,
  okObject,
  saveToLocalStorage,
} from "./Utils";

/**
 *
 * @param input
 * @param items
 * @returns Parse object with OK and Action properties
 */
export function Parse(input: string, items: Item[]): MyRequest {
  let cleaned = input.replace(/ +/g, " ").toLowerCase();
  let parts = cleaned.split(" ");
  let noun = parts.length > 1 ? parts.slice(1).join(" ") : null;
  let actual = parts[0];
  let trunc = Truncations.find((t) => {
    return t.short === actual;
  })?.long;
  let verb = trunc === null || trunc === undefined ? actual : trunc;

  //#region get player
  let player = getPlayer(items);
  if (player === null || player === undefined) {
    return {
      OK: false,
      Look: { Refresh: true, Brevity: false },
      Action: {
        UnconditionalResponse: `You have ceased to exist, but through the magic of adventure you are granted an extra life and teleported back to ${FrontStreet}.`,
        Updates: [
          {
            TargetItem: Player,
            Property: Location,
            Value: FrontStreet,
          } as Update,
        ],
      } as Action,
    } as MyRequest;
  }
  //#endregion

  //#region get player's location
  let location = getLocation(items);
  if (location === null || location === undefined) {
    return {
      OK: true,
      Look: { Refresh: true, Brevity: false },
      Action: {
        UnconditionalResponse: `You have fallen off the map, but through the magic of adventure you are granted an extra life and teleported back to ${FrontStreet}.`,
        Updates: [
          {
            TargetItem: Player,
            Property: Location,
            Value: FrontStreet,
          } as Update,
        ],
      } as Action,
    } as MyRequest;
  }
  //#endregion

  //#region VERB only
  if (!noun) {
    //#region Move (n, s, e, w, u, d, i, o)
    let isMove = Moves.find((m) => m === verb);
    if (isMove !== null && isMove !== undefined) {
      let move = location?.Actions?.find((a) => {
        let split = a.Verb.toLowerCase().split(",");
        return split.includes(verb);
      });

      //check for invalid move
      if (move === null || move === undefined) {
        return {
          OK: false,
          Look: { Refresh: false, Brevity: true },
          Action: {
            UnconditionalResponse: "You can't move in that direction.",
          } as Action,
        } as MyRequest;
      }
      //valid move
      return {
        OK: true,
        Look: { Refresh: true, Brevity: true },
        Action: move,
      } as MyRequest;
    }
    // #endregion

    //#region LOOK
    if (verb === Look) {
      return {
        OK: true,
        Look: { Refresh: true, Brevity: false },
        //create a dummy action to move the player to the same location
        //  this is all to achieve a move count on the very first move!
        Action: {
          Updates: [
            {
              TargetItem: Player,
              Property: Location,
              Value: location.Name,
            } as Update,
          ],
        } as Action,
      } as MyRequest;
    }
    //#endregion

    //#region INVENTORY
    if (verb === Inventory) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: getInventory(items),
        } as Action,
      } as MyRequest;
    }
    //#endregion

    //#region HELP
    if (verb === Help) {
      let local = getHelpItems(items);
      let helps = local
        .filter((i) => {
          return i.Help !== null && i.Help !== undefined;
        })
        .map((i) => {
          return i.Help;
        });
      if (helps.length === 0) {
        return {
          OK: true,
          Look: { Refresh: false, Brevity: true },
          Action: {
            UnconditionalResponse:
              "Like the majority of school life, there is no help here.",
          } as Action,
        } as MyRequest;
      }
      return {
        OK: true,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: getRandomElement(helps),
        } as Action,
      } as MyRequest;
    }
    //#endregion

    //#region ABOUT
    if (verb === About) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: AboutResponse,
        } as Action,
      } as MyRequest;
    }
    //#endregion

    //#region INSTRUCTIONS
    if (verb === Instructions) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: InstructionsResponse,
        } as Action,
      } as MyRequest;
    }
    //#endregion

    //#region LOAD
    if (verb === Load) {
      let load = loadFromLocalStorage(LocalStoargeKey);
      if (load === undefined) {
        return {
          OK: false,
          Look: { Refresh: false, Brevity: true },
          Action: {
            UnconditionalResponse: "No saved game found.",
          } as Action,
        } as MyRequest;
      }
      let warning = isVersionLessThan(
        getItemByName(load, Version)?.Description,
        getItemByName(items, Version)?.Description
      );
      let response = `Saved game loaded, take a look around.${
        warning
          ? "|WARNING: Saved game data was created using an older version of the world, you can continue from the saved position but problems may occur."
          : ""
      }`;
      return {
        OK: false,
        Look: { Refresh: true, Brevity: false },
        Action: {
          UnconditionalResponse: response,
          Updates: [
            {
              TargetItem: Player,
              Property: Location,
              Value: location.Name,
            } as Update,
          ],
        } as Action,
        Load: load,
      } as MyRequest;
    }
    //#endregion

    //#region SAVE
    if (verb === Save) {
      let save = saveToLocalStorage(LocalStoargeKey, items);
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: save,
        } as Action,
      } as MyRequest;
    }
    //#endregion

    //#region INVALID
    return {
      OK: false,
      Look: { Refresh: false, Brevity: true },
      Action: { UnconditionalResponse: "You can't do that here." } as Action,
    } as MyRequest;
    //#endregion
  }
  //#endregion

  //#region VERB & NOUN

  //#region GET
  if (verb === Get) {
    if (getCarriedItems(items).length > InventoryLimit) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "You cannot carry any more.",
        } as Action,
      } as MyRequest;
    }
    let gettables = getGettableItems(items, noun);
    if (gettables.length > 1) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "You'll have to be more specific.",
        } as Action,
      } as MyRequest;
    }

    let item = gettables[0];
    if (item === null || item === undefined) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "You can't get that.",
        } as Action,
      } as MyRequest;
    }
    //get any specified get actions (with conditions)
    let action = item.Actions?.find((a) => {
      return inCsv(a.Verb, Get);
    });
    //create default get action if no custom get action defined
    if (action === null || action === undefined) {
      return {
        OK: true,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: `You got the ${item.Name.split(",")[0]}.`,
          Updates: [
            {
              TargetItem: item.Name.split(",")[0],
              Property: Location,
              Value: Player,
            },
            //add counter update
            {
              TargetItem: item.Name.split(",")[0],
              Property: Count,
            },
          ],
        } as Action,
      } as MyRequest;
    }
    //return custom get action, to check any conditions
    return {
      OK: true,
      Look: { Refresh: false, Brevity: true },
      Action: action as Action,
    } as MyRequest;
  }
  //#endregion

  //#region DROP
  if (verb === Drop) {
    let droppables = getDropableItems(items, noun);
    if (droppables.length > 1) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "You'll have to be more specific.",
        } as Action,
      } as MyRequest;
    }

    let item = droppables[0];
    if (item === null || item === undefined) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "You can't drop that.",
        } as Action,
      } as MyRequest;
    }
    //get any specified drop actions (with conditions)
    let action = item.Actions?.find((a) => {
      return inCsv(a.Verb, Drop);
    });
    //create default drop action is no custom drop action defined
    if (action === null || action === undefined) {
      return {
        OK: true,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: `You dropped the ${item.Name.split(",")[0]}.`,
          Updates: [
            {
              TargetItem: item.Name.split(",")[0],
              Property: Location,
              Value: location.Name,
            },
            //add counter update
            {
              TargetItem: item.Name.split(",")[0],
              Property: Count,
            },
          ],
        } as Action,
      } as MyRequest;
    }
    //return custom drop action
    return {
      OK: true,
      Look: { Refresh: false, Brevity: true },
      Action: action as Action,
    } as MyRequest;
  }
  //#endregion

  //#region EXAMINE
  if (verb === Examine) {
    let local = getAccessibleItems(items);
    let examinables = getItemsByName(local, noun);
    if (examinables.length > 1) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "You'll have to be more specific.",
        } as Action,
      } as MyRequest;
    }

    let item = examinables[0];
    if (item === null || item === undefined) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "You can't see that here.",
        } as Action,
      } as MyRequest;
    }
    //create default examine action is no custom examine action defined
    let state =
      item.State === null || item.State === undefined
        ? ""
        : ` ${capitalizeFirstLetter(item.State)}`;
    return {
      OK: true,
      Look: { Refresh: false, Brevity: true },
      Action: {
        UnconditionalResponse: `${item.Description}${state}`,
        //add counter update
        Updates: [
          {
            TargetItem: item.Name.split(",")[0],
            Property: Count,
          },
        ],
      } as Action,
    } as MyRequest;
  }
  //#endregion

  //#region WHERE
  if (verb === Where) {
    let item = getItemByName(items, noun);
    if (
      item === null ||
      item === undefined ||
      item.Count === undefined ||
      Number.isNaN(item.Count) ||
      item.Count === 0
    ) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: `You haven't discovered ${
            item?.Prefix === undefined ? "" : item?.Prefix
          } ${item?.Name?.split(",")[0]} yet.`,
        } as Action,
      } as MyRequest;
    }
    //if item is in inventory, return carried message
    if (item?.Location === Player) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: `You are carrying ${
            item?.Prefix === undefined ? "" : item?.Prefix
          } ${item?.Name?.split(",")[0]}.`,
        } as Action,
      } as MyRequest;
    }
    return {
      OK: false,
      Look: { Refresh: false, Brevity: true },
      Action: {
        UnconditionalResponse: `You close your eyes and concentrate on where you last saw ${
          item?.Prefix === undefined ? "" : item?.Prefix
        } ${item?.Name?.split(",")[0]}... \"${
          item?.Location
        }\" springs to mind.`,
      } as Action,
    } as MyRequest;
  }
  //#endregion

  //#region GO
  if (verb === Go) {
    let target = getItemByName(items, noun);
    if (
      target === null ||
      target === undefined ||
      target.Count === undefined ||
      Number.isNaN(target.Count)
    ) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: `You close your eyes and think of \"${noun}\", but it doesn't ring any bells.`,
        } as Action,
      } as MyRequest;
    }
    return {
      OK: true,
      Look: { Refresh: true, Brevity: true },
      Action: {
        UnconditionalResponse: `You close your eyes, think of \"${noun}\", recall the route and quickly follow it.`,
        Updates: [
          {
            TargetItem: Player,
            Property: Location,
            Value: target.Name,
          } as Update,
        ],
      } as Action,
    } as MyRequest;
  }

  //#endregion

  //#region CUSTOM VERB
  let local = getAccessibleItems(items);
  let accessibles = getItemsByName(local, noun);
  if (accessibles.length > 1) {
    return {
      OK: false,
      Look: { Refresh: false, Brevity: true },
      Action: {
        UnconditionalResponse: "You'll have to be more specific.",
      } as Action,
    } as MyRequest;
  }

  let target = getItemByName(local, noun);
  let action = target?.Actions?.find((a) => inCsv(a.Verb, verb));
  if (okObject(action)) {
        return {
      OK: true,
      Look: { Refresh: false, Brevity: true },
      Action: action,
    } as MyRequest;
  }

  //#endregion

  return {
    OK: false,
    Look: { Refresh: false, Brevity: true },
    Action: {
      UnconditionalResponse: "Sorry, I don't understand.",
    } as Action,
  } as MyRequest;
  //#endregion
}
