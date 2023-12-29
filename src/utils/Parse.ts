import { About } from "../content/Blurb";
import { Player, Location, Look, Help, Get } from "../content/Constants";
import { Moves } from "../content/Moves";
import Truncations from "../content/Truncations.json";
import { getLocalItems } from "./ItemQueries";
import { Inventory, getRandomElement } from "./Utils";

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
  let player = items.find((i) => {
    return i.Type === Player;
  });
  if (player === null || player === undefined) {
    return {
      OK: false,
      Look: { Refresh: false, Brevity: true },
      Action: { UnconditionalResponse: "You have ceased to exist." } as Action,
    };
  }
  //#endregion

  //#region get player's location
  let location = items.find((i) => {
    return i.Type === Location && i.Location === player?.Location;
  });
  if (location === null || location === undefined) {
    return {
      OK: false,
      Look: { Refresh: false, Brevity: true },
      Action: {
        UnconditionalResponse: "You have fallen off the map.",
      } as Action,
    };
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
        };
      }
      //valid move
      return {
        OK: true,
        Look: { Refresh: true, Brevity: true },
        Action: move,
      };
    }
    // #endregion

    //#region Look
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
      };
    }

    //#region Inventory
    if (verb === "inventory") {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: Inventory(items),
        } as Action,
      };
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
        };
      }
      return {
        OK: true,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: getRandomElement(helps),
        } as Action,
      };
    }
    //#endregion

    //#region About
    if (verb === "about") {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: About(),
        } as Action,
      };
    }
    //#endregion

    //#region Instructions
    if (verb === "instructions") {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "TODO: Work in progres...",
        } as Action,
      };
    }
    //#engregion

    //#region invalid verb
    return {
      OK: false,
      Look: { Refresh: false, Brevity: true },
      Action: { UnconditionalResponse: "You can't do that here." } as Action,
    };
    //#endregion
  }
  //#endregion

  //#region VERB & NOUN

  //#region GET
  if (verb === Get) {
    let item = items.find((i) => {
      return (
        i.Name === noun && i.Location === location?.Name && i.Type === "mobile"
      );
    });
    if (item === null || item === undefined) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "You can't get that.",
        } as Action,
      };
    }
    //get any specified get actions (with conditions)
    let action = item.Actions?.find((a) => {
      return a.Verb === Get;
    });
    //create default get action is no custom get action defined
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
      };
    }
    //return custom get action, to check any conditions
    //TODO: Need to assert the Update Value property to current Player
    return {
      OK: true,
      Look: { Refresh: false, Brevity: true },
      Action: action as Action,
    };
  }
  //#endregion

  //#region DROP
  if (verb === "drop") {
    let item = items.find((i) => {
      return (
        i.Name === noun &&
        (i.Location === location?.Name || i.Location === Player)
      );
    });
    if (item === null || item === undefined) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "You can't drop that.",
        } as Action,
      };
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
      };
    }
    //return custom drop action
    //TODO: Need to assert the Update Value property to current location
    return {
      OK: true,
      Look: { Refresh: false, Brevity: true },
      Action: action as Action,
    };
  }
  //#endregion

  //#region EXAMINE
  if (verb === "examine") {
    let item = items.find((i) => {
      return (
        i.Name === noun &&
        (i.Location === location?.Name || i.Location === Player)
      );
    });
    if (item === null || item === undefined) {
      return {
        OK: false,
        Look: { Refresh: false, Brevity: true },
        Action: {
          UnconditionalResponse: "You can't examine that here.",
        } as Action,
      };
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
    };
  }
  //#endregion

  return {
    OK: false,
    Look: { Refresh: false, Brevity: true },
    Action: {
      UnconditionalResponse: "Sorry, I don't understand.",
    } as Action,
  };
  //#endregion
}
