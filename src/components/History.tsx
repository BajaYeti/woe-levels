import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { guid } from "../Utils";
import { Carat } from "../content/Constants";
import { useWindowSize } from "../utils/WindowSize";

type HistoryType = {
  history: string[];
};

export default function History(props: HistoryType) {
  const { height } = useWindowSize(250);
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
      //input
      if (h.startsWith(Carat)) {
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
      if (h.includes("|")) {
        //if multi line content
        return h.split("|").map((r: string) => {
          return (
            <Typography key={guid()} sx={{ color: "text.primary" }}>
              {r}
            </Typography>
          );
        });
      } else {
        //single line content
        return (
          <Typography key={guid()} sx={{ color: "text.primary" }}>
            {h}
          </Typography>
        );
      }
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
