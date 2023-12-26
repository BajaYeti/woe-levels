import { Typography } from "@mui/material";
import "../global.css";

export default function Footer(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ pt: 3 }}
      className="wl-noselect"
    >
      {process.env.REACT_APP_TITLE} {process.env.REACT_APP_VERSION} - Copyright ©{" "}
      {process.env.REACT_APP_AUTHOR} {new Date().getFullYear()}
    </Typography>
  );
}
