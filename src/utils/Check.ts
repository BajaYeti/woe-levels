import { getItemByName } from "./ItemQueries";
import { okObject, okString, valuesEqual, valuesLike } from "./Utils";

/**
 * Check all conditions for an action
 * @param action
 * @param items
 * @returns
 */
export function Check(action: Action, items: Array<Item>): Check {
  if (
    action.Conditions === null ||
    action.Conditions === undefined ||
    action.Conditions.length === 0
  ) {
    return { OK: true, Feedback: null };
  }

  let checked: Array<Check> = action.Conditions.map((c) => {
    let item = getItemByName(items, c.Item);
    if (!okObject(item) === null || item === undefined) {
      return { OK: false, Feedback: "Uh oh!" };
    }

    //get value of target property
    let value = "";
    switch (c.Property) {
      case "state":
        value = item.State?.toLowerCase();
        break;
      default: //Location is default
        value = item.Location.toLowerCase();
        break;
    }

    //check condition against value using the equality operator
    switch (c.Equality) {
      case "!":
        //DOES NOT EQUAL
        return valuesEqual(value, c.Value)
          ? { OK: false, Feedback: c.FailResponse }
          : { OK: true, Feedback: c.PassResponse };

      case "*":
        //LIKE
        return valuesLike(value, c.Value)
          ? { OK: true, Feedback: c.PassResponse }
          : { OK: false, Feedback: c.FailResponse };

      case "!*":
        //NOT LIKE
        return valuesLike(value, c.Value)
          ? { OK: false, Feedback: c.FailResponse }
          : { OK: true, Feedback: c.PassResponse };

      default:
        //EQUALS
        return valuesEqual(value, c.Value)
          ? { OK: true, Feedback: c.PassResponse }
          : { OK: false, Feedback: c.FailResponse };
    }
  });

  //return flatted uncondition response if all conditions pass
  let failed = checked.find((c) => c.OK === false);
  if (failed === null || failed === undefined) {
    let filtered = checked.filter((c) => okString(c.Feedback));
    let flattened = filtered.map((c) => c.Feedback).join(". ");
    return { OK: true, Feedback: flattened };
  }
  return failed;
}
