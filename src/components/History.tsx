import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useWindowSize } from "./useWindowSize";
import { guid } from "../Utils";

type HistoryType = {
  history: string[];
};

export default function History(props: HistoryType) {
  const { height, width } = useWindowSize(250);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(scrollToBottom, [props.history]);

  const rows = () => {
    let rv = [] as any;
    rv = props.history.map((h: string) => {
      //TODO. encode a line break here... split on \n and then map each element to a new Typopgraphy
      // history: string[]; could be extended to a type that include the type of message to display
      //input
      if (h.startsWith("-")) {
        return (
          <Typography key={guid()} sx={{ color: "text.secondary" }}>
            {h}
          </Typography>
        );
      }
      //blank line
      if (h === ".") {
        return (
          <Typography key={guid()} sx={{ color: "text.secondary" }}>
            &nbsp;
          </Typography>
        );
      }
      //output
      return (
        <Typography key={guid()} sx={{ color: "text.primary" }}>
          {h}
        </Typography>
      );
    });

    return <Box sx={{ p: 0 }}>{rv}</Box>;
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "secondary.dark",
        borderRadius: 1,
        p: 2,
        mt: 3,
        // bgcolor: "#2e2e2e",
        overflow: "auto",
        mb: 3,
        height: () => {
          return height - 170;
        },
      }}
    >
      {rows()}
      <div ref={messagesEndRef} />
    </Box>
  );
}
