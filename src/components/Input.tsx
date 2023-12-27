import React, { useEffect } from "react";
import { TextField, capitalize } from "@mui/material";
import { Parse } from "../utils/Parse";
import { Process } from "../utils/Process";
import { Check } from "../utils/Check";
import { Carat, Player } from "../content/Constants";
import { View } from "../utils/View";
import { Exits, capitalizeFirstLetter } from "../utils/Utils";
import { getItemByName } from "../utils/ItemQueries";

type CommandType = {
  items: Array<Item>;
  setItems: (x: Array<Item>) => void;
  log: string[];
  setLog: (x: string[]) => void;
};

export default function Input(props: CommandType) {
  //rename to INPUT
  const [input, setInput] = React.useState<string>("");
  useEffect(() => {
    act("look");
  }, []);

  const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (input) {
        act(input);
      }
    }
  };

  const act = (scopedInput: string) => {
    let newLog = [...props.log];
    newLog.push(`${Carat} ${scopedInput}`);

    //#region parse scopedInput
    let request = Parse(scopedInput, props.items);
    if (
      request.Action.UnconditionalResponse !== null &&
      request.Action.UnconditionalResponse !== undefined
    ) {
      newLog.push(request.Action.UnconditionalResponse);
    }
    if (request.OK === false) {
      props.setLog(newLog);
      setInput("");
      return;
    }
    //#endregion

    //#region check conditions
    let repsone = Check(request.Action, props.items);
    if (repsone.Feedback) {
      newLog.push(repsone.Feedback);
    }
    if (repsone.OK === false) {
      props.setLog(newLog);
      setInput("");
      return;
    }
    //#endregion

    //#region process response
    let result = Process(request.Action, props.items);
    if (result.length > 0) {
      props.setItems(result);
      let player = result.find((i) => i.Name === Player);
      let location = props.items.find((l) => l.Name === player?.Location);
      //if user moved, display new location description
      if (location !== null && location !== undefined && request.Look) {
        newLog.push(
          `${capitalizeFirstLetter(location?.Name)}: ${location?.Description}`
        );
        newLog.push(Exits(location));
        newLog.push(View(props.items));
      }
    }
    //#endregion

    props.setLog(newLog);
    setInput("");
  };

  const requestHandler = (e: string) => {
    setInput(e);
  };

  return (
    <TextField
      fullWidth={true}
      label="Action"
      value={input}
      onChange={(e: any) => requestHandler(e.target.value)}
      onKeyDown={(e) => keyPress(e)}
    ></TextField>
  );
}
