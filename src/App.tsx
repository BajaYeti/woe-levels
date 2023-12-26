import { Box, Container } from "@mui/material";
import Input from "./components/Input";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Footer from "./components/Footer";
import History from "./components/History";
import React from "react";
import initialWorld from "../src/content/initialWorld.json";
import { Blurb } from "./content/Blurb";

function App() {
  //#region ThemeProvider
  // use User's system preference for light/dark mode
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // create theme with pallette
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      // Blue
      primary: {
        light: "#009BDF",
        main: "#0E4496",
        dark: "#1F1646",
      },
      // Grey
      secondary: {
        light: "#D0D2D2",
        main: "#A3AAAE",
        dark: "#323E48",
      },
      // Teal
      info: {
        main: "#00A6B6",
        dark: "#0D818D",
      },
      // Gold
      warning: {
        main: "#FECC16",
        dark: "#C29F13",
      },
      // Red
      error: {
        main: "#FF0000",
        dark: "#FF0000",
      },
      // Green
      success: {
        main: "#008000",
        dark: "#008000",
      },
    },
  });
  //#endregion

  //#region HOOKS
  const [items, setItems] = React.useState<Array<Item>>(
    JSON.parse(JSON.stringify(initialWorld))
  );
  const [log, setLog] = React.useState<string[]>(Blurb());
  //#endregion

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Container maxWidth="xl">
          <Box component="main">
            <History history={log} />
          </Box>
          <Input items={items} setItems={setItems} log={log} setLog={setLog} />
          <Footer />
        </Container>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
