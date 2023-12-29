import { Typography } from "@mui/material";
import "../global.css";
import { AppAuthor, AppTitle, AppVersion } from "../content/Constants";

export default function Footer(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ pt: 3 }}
      className="wl-noselect"
    >
      {AppTitle} {AppVersion} - Copyright © {AppAuthor}{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}
