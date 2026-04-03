import { alpha, createTheme } from "@mui/material/styles";

export function getAppTheme(mode) {
  const isDark = mode === "dark";

  const palette = isDark
    ? {
        mode: "dark",
        primary: { main: "#12cfff" },
        background: {
          default: "#050505",
          paper: "#161616",
        },
        text: {
          primary: "#ffffff",
          secondary: "rgba(255,255,255,0.7)",
          tertiary: "rgba(255,255,255,0.54)",
        },
        divider: "rgba(255,255,255,0.08)",
      }
    : {
        mode: "light",
        primary: { main: "#4358d0" },
        background: {
          default: "#fcfbf8",
          paper: "#ffffff",
        },
        text: {
          primary: "#141414",
          secondary: "#66656b",
          tertiary: "#96959d",
        },
        divider: "#ece7df",
      };

  return createTheme({
    palette,
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: `"Space Grotesk", "Inter", "Segoe UI", sans-serif`,
      h1: {
        fontWeight: 700,
      },
      button: {
        textTransform: "none",
        fontWeight: 700,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
          },
          "::selection": {
            backgroundColor: alpha(palette.primary.main, 0.2),
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            paddingInline: 24,
            paddingBlock: 12,
            boxShadow: isDark
              ? "none"
              : "0 12px 24px rgba(67, 88, 208, 0.18)",
          },
          contained: {
            backgroundColor: isDark ? "#39c7ef" : "#4358d0",
            color: isDark ? "#041016" : "#ffffff",
            backgroundImage: "none",
            "&:hover": {
              backgroundColor: isDark ? "#2eb8e0" : "#384dbd",
              backgroundImage: "none",
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            backgroundImage: "none",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: palette.text.primary,
          },
        },
      },
    },
  });
}
