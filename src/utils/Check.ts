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
    let item = items.find((i) => i.Name === c.Item);
    if (item === null || item === undefined) {
      return { OK: false, Feedback: "Uh oh!" };
    }

    //get value of target property
    let value = "";
    switch (c.Property) {
      case "state":
        value = item.State.toLowerCase();
        break;
      default: //Location is default
        value = item.Location.toLowerCase();
        break;
    }

    //check condition against value using the equality operator
    switch (c.Equality) {
      case "*":
        //like/contains
        if (value.includes(c.Value.toLowerCase())) {
          return { OK: true, Feedback: c.PassResponse };
        } else {
          return { OK: false, Feedback: c.FailResponse };
        }

      case "!":
        //does not equal
        if (value === c.Value.toLowerCase()) {
          return { OK: true, Feedback: c.PassResponse };
        } else {
          return { OK: false, Feedback: c.FailResponse };
        }

      case "!*":
        //is not like, does not contain
        if (value === c.Value.toLowerCase()) {
          return { OK: true, Feedback: c.PassResponse };
        } else {
          return { OK: false, Feedback: c.FailResponse };
        }

      default:
        //Equals exactly
        if (value === c.Value.toLowerCase()) {
          return { OK: true, Feedback: c.PassResponse };
        } else {
          return { OK: false, Feedback: c.FailResponse };
        }
    }
  });

  //return flatted uncondition response if all conditions pass
  let failed = checked.find((c) => c.OK === false);
  if (failed === null || failed === undefined) {
    let flattened = checked.map((c) => c.Feedback).join(". ");
    return { OK: true, Feedback: flattened };
  }
  return failed;
}
