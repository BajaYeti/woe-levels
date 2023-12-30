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
} from "../content/Constants";
import { Truncations } from "../content/Constants";
import {
  getDropableItem,
  getGettableItem,
  getLocalItem,
  getLocalItems,
  getLocation,
  getPlayer,
} from "./ItemQueries";
import {
  getInventory,
  getRandomElement,
  loadFromLocalStorage,
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
      Look: { Refresh: false, Brevity: true },
      Action: { UnconditionalResponse: "You have ceased to exist." } as Action,
    } as MyRequest;
  }
  //#endregion

  //#region get player's location
  let location = getLocation(items);
  if (location === null || location === undefined) {
    return {
      OK: false,
      Look: { Refresh: false, Brevity: true },
      Action: {
        UnconditionalResponse: "You have fallen off the map.",
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

    //#endregion

    //#region HELP
    if (verb === Help) {
      let local = getLocalItems(items, location?.Name);
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
      return {
        OK: false,
        Look: { Refresh: true, Brevity: false },
        Action: {
          UnconditionalResponse: "Saved game loaded, take a look around.",
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
    let item = getGettableItem(items, noun);
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
      return a.Verb === Get;
    });
    //create default get action if no custom get action defined
    if (action === null || action === undefined) {
      return {
        OK: true,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: `You got the ${item.Name}.`,
          Updates: [
            {
              TargetItem: item.Name,
              Property: "Location",
              Value: Player,
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
  if (verb === "drop") {
    let item = getDropableItem(items, noun);
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
      return a.Verb === "drop";
    });
    //create default drop action is no custom drop action defined
    if (action === null || action === undefined) {
      return {
        OK: true,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: `You dropped the ${item.Name}.`,
          Updates: [
            {
              TargetItem: item.Name,
              Property: "Location",
              Value: location.Name,
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
    let item = getLocalItem(items, noun);
    if (item === null || item === undefined) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "You can't examine that here.",
        } as Action,
      } as MyRequest;
    }
    //create default examine action is no custom examine action defined
    let state =
      item.State === null || item.State === undefined ? "" : ` ${item.State}`;
    return {
      OK: false,
      Look: { Refresh: false, Brevity: true },
      Action: {
        UnconditionalResponse: `${item.Description}${state}`,
      } as Action,
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
