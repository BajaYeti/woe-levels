import { Typography } from "@mui/material";
import "../global.css";
import { AppAuthor, AppTitle, AppVersion, Version } from "../content/Constants";
import { getItemByName } from "../utils/ItemQueries";

type FooterType = {
  items: Array<Item>;
};

export default function Footer(props: FooterType) {
  const world = getItemByName(props.items, Version);
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ pt: 3 }}
      className="wl-noselect"
    >
      {AppTitle} V{AppVersion}.{world?.Description} Copyright © {AppAuthor}{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}
