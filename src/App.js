import "./App.css";
import {
  alpha,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  ContentCopyRounded,
  DarkModeRounded,
  DoneRounded,
  LightModeRounded,
  LinkRounded,
  MoreHorizRounded,
  QrCode2Rounded,
  SecurityRounded,
  FlashOnRounded,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { getAppTheme } from "./theme";
import { apiConfig, env } from "./config/env";

const navItems = ["Dashboard", "Analytics"];

const historyRows = [
  {
    title: "Q3 Campaign - Twitter",
    created: "Created 2 hours ago",
    shortUrl: "subzero.io/cam-392",
    clicks: "1,204",
    ping: "2m ago",
  },
  {
    title: "Internal Docs - HR",
    created: "Created 1 day ago",
    shortUrl: "subzero.io/hr-docs",
    clicks: "84",
    ping: "14h ago",
  },
  {
    title: "Fall Promo - Email",
    created: "Created 3 days ago",
    shortUrl: "subzero.io/fall24",
    clicks: "5,912",
    ping: "2d ago",
  },
];

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");
  const [url, setUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(true);
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const theme = useMemo(() => getAppTheme(mode), [mode]);
  const isDark = mode === "dark";

  const recentTitle = shortUrl || "subzero.io/glacier-842";
  const recentOriginal =
    url || "https://workspace.google.com/products/analytics/reports/realtime-view-dashboard-2024";

  const handleCopy = async () => {
    const value = shortUrl || recentTitle;
    try {
      if (navigator.permissions?.query) {
        const permissionStatus = await navigator.permissions.query({
          name: "clipboard-write",
        });
        if (permissionStatus.state === "denied") {
          window.alert(
            "Clipboard access denied. Please allow clipboard access in your browser settings."
          );
          return;
        }
      }
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      window.alert("Clipboard copy failed. Please try again.");
    }
  };

  const handleShorten = async () => {
    if (!url.trim()) {
      window.alert("Please enter a URL.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(apiConfig.generateShortUrl, {
        params: { url },
      });
      setShortUrl(response.data.message);
    } catch (error) {
      window.alert("Unable to generate a short URL right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Please Note</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">
              Due to hosting limitations, the app may take a little while to load on
              first open while the backend wakes up.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button variant="contained" onClick={() => setDialogOpen(false)}>
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        <Box
          component="header"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            backdropFilter: "blur(20px)",
            bgcolor: alpha(theme.palette.background.default, isDark ? 0.86 : 0.9),
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Container maxWidth="xl">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ minHeight: 88 }}
            >
              <Stack direction="row" alignItems="center" spacing={{ xs: 3, md: 8 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: isDark ? "#ffffff" : theme.palette.primary.main,
                  }}
                >
                  {env.appName}
                </Typography>
                <Stack direction="row" spacing={4} sx={{ display: { xs: "none", md: "flex" } }}>
                  {navItems.map((item, index) => (
                    <Box
                      key={item}
                      sx={{
                        position: "relative",
                        pb: 1.75,
                        color:
                          index === 0
                            ? "text.primary"
                            : alpha(theme.palette.text.primary, 0.62),
                        fontWeight: index === 0 ? 600 : 500,
                      }}
                    >
                      <Typography>{item}</Typography>
                      {index === 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: 2,
                            borderRadius: 999,
                            bgcolor: theme.palette.primary.main,
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Stack>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton onClick={() => setMode(isDark ? "light" : "dark")} color="inherit">
                  {isDark ? <LightModeRounded /> : <DarkModeRounded />}
                </IconButton>
                <IconButton color="inherit">
                  <AccountCircleOutlined />
                </IconButton>
              </Stack>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", lg: "1.55fr 0.9fr" },
              alignItems: "start",
            }}
          >
            <Box sx={{ pt: { md: 5 }, pr: { lg: 4 } }}>
              <Typography
                variant="h1"
                sx={{
                  maxWidth: 720,
                  fontSize: { xs: "3.4rem", md: "5rem", lg: "5.7rem" },
                  lineHeight: 0.94,
                  letterSpacing: "-0.06em",
                  fontWeight: 700,
                }}
              >
                {isDark ? "Shorten the" : "Precision "}
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.primary.main,
                    display: isDark ? "block" : "inline",
                  }}
                >
                  {isDark ? "Digital Void." : "Connectivity."}
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  maxWidth: 690,
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  lineHeight: 1.55,
                  color: "text.secondary",
                }}
              >
                {isDark
                  ? "High-speed URL precision for the modern architect. Secure, tracked, and instantaneous."
                  : "Deploy high-performance short links with Sub-Zero's minimalist URL architecture. Clean, fast, and engineered for data-dense environments."}
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  mt: 5,
                  p: 1,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: isDark ? "#2d2d2d" : "#ffffff",
                  border: "1px solid",
                  borderColor: isDark ? alpha("#ffffff", 0.08) : "#e9e6de",
                  boxShadow: isDark
                    ? "0 10px 24px rgba(0,0,0,0.25)"
                    : "0 22px 50px rgba(52, 74, 189, 0.08)",
                  maxWidth: 760,
                }}
              >
                {!isDark && (
                  <Box sx={{ px: 2, color: "text.secondary", display: { xs: "none", sm: "flex" } }}>
                    <LinkRounded />
                  </Box>
                )}
                <InputBase
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder={
                    isDark
                      ? "Paste your long transmission here..."
                      : "https://your-long-enterprise-url.com/data/analytics"
                  }
                  sx={{
                    flex: 1,
                    px: { xs: 2, sm: isDark ? 3 : 0 },
                    py: 1.9,
                    fontSize: { xs: "1rem", md: "1.05rem" },
                    color: "text.primary",
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleShorten}
                  disableElevation
                  sx={{
                    minWidth: { xs: 120, sm: 174 },
                    alignSelf: "stretch",
                    borderRadius: 3,
                    fontSize: "1.05rem",
                    fontWeight: 700,
                  }}
                >
                  Shorten
                </Button>
              </Paper>

              {!isDark && (
                <Stack direction="row" spacing={2} sx={{ mt: 1.6, color: "text.tertiary" }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <FlashOnRounded sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.16em" }}>
                      INSTANT API
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <SecurityRounded sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.16em" }}>
                      SSL SECURED
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Box>

            <Box
              sx={{
                minHeight: { xs: 320, md: 440 },
                borderRadius: isDark ? "50%" : 6,
                position: "relative",
                overflow: "hidden",
                bgcolor: isDark ? "transparent" : "#efefef",
                border: isDark ? "none" : "1px solid #ebe8e1",
                boxShadow: isDark ? "none" : "inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            >
              {isDark ? (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    background:
                      "radial-gradient(circle at center, rgba(12, 217, 255, 0.16), rgba(0, 0, 0, 0) 52%)",
                  }}
                >
                  {[1, 2, 3].map((ring) => (
                    <Box
                      key={ring}
                      sx={{
                        position: "absolute",
                        width: `${ring * 28 + 28}%`,
                        aspectRatio: "1 / 1",
                        borderRadius: "50%",
                        border: `1px solid ${alpha("#8be7ff", ring === 1 ? 0.5 : 0.24)}`,
                        boxShadow:
                          ring === 1 ? "0 0 40px rgba(12,217,255,0.22), inset 0 0 24px rgba(12,217,255,0.14)" : "none",
                      }}
                    />
                  ))}
                  <Box
                    sx={{
                      width: 170,
                      height: 240,
                      borderRadius: 6,
                      border: "4px solid #19d5ff",
                      boxShadow:
                        "0 0 22px rgba(25,213,255,0.8), inset 0 0 32px rgba(25,213,255,0.55)",
                      background:
                        "linear-gradient(180deg, rgba(3,22,29,0.95), rgba(2,9,13,0.98))",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 20,
                        borderRadius: 4,
                        border: "2px solid rgba(25,213,255,0.55)",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: "50%",
                          top: 16,
                          bottom: 16,
                          width: 10,
                          transform: "translateX(-50%)",
                          borderRadius: 999,
                          background:
                            "linear-gradient(180deg, rgba(25,213,255,0.12), rgba(25,213,255,0.85), rgba(25,213,255,0.12))",
                          boxShadow: "0 0 22px rgba(25,213,255,0.85)",
                        },
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 78% 80%, rgba(77,105,255,0.12), transparent 12%), radial-gradient(circle at 66% 68%, rgba(77,105,255,0.18), transparent 10%), linear-gradient(140deg, rgba(255,255,255,0.78), rgba(225,228,236,0.94))",
                  }}
                />
              )}

              {!isDark && (
                <>
                  <Box
                    sx={{
                      position: "absolute",
                      width: 540,
                      height: 540,
                      borderRadius: "50%",
                      left: -120,
                      top: 56,
                      border: "1px solid rgba(130, 155, 255, 0.18)",
                      boxShadow: "0 0 60px rgba(105, 125, 225, 0.06)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: "12% -8%",
                        background:
                          "radial-gradient(closest-side, rgba(255,255,255,0) 58%, rgba(130,155,255,0.12) 68%, rgba(255,255,255,0) 74%)",
                        transform: "rotate(18deg)",
                      },
                    }}
                  />
                  <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ position: "absolute", inset: 0, color: theme.palette.primary.main }}
                  >
                    <Box sx={{ position: "relative", width: 92, height: 92 }}>
                      {[0, 1, 2, 3, 4].map((item) => {
                        const angles = [
                          { left: 34, top: 0 },
                          { left: 66, top: 25 },
                          { left: 54, top: 62 },
                          { left: 14, top: 62 },
                          { left: 2, top: 25 },
                        ];
                        return (
                          <Box
                            key={item}
                            sx={{
                              position: "absolute",
                              left: angles[item].left,
                              top: angles[item].top,
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              bgcolor: theme.palette.primary.main,
                              boxShadow: "0 10px 18px rgba(67, 90, 205, 0.2)",
                            }}
                          />
                        );
                      })}
                      <Box
                        sx={{
                          position: "absolute",
                          left: 31,
                          top: 31,
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          bgcolor: theme.palette.primary.main,
                        }}
                      />
                    </Box>
                    <Typography sx={{ fontWeight: 700, letterSpacing: "0.18em", fontSize: 20 }}>
                      GLOBAL NODE FLOW
                    </Typography>
                  </Stack>
                </>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              mt: { xs: 6, md: 8 },
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", lg: isDark ? "1fr" : "2fr 1fr" },
            }}
          >
            <Box>
              <SectionEyebrow dark={isDark}>Recent Generation</SectionEyebrow>
              <Paper
                elevation={0}
                sx={{
                  mt: 2.5,
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden",
                  bgcolor: isDark ? "#222222" : theme.palette.primary.main,
                  color: isDark ? "#ffffff" : "#ffffff",
                  border: "1px solid",
                  borderColor: isDark ? alpha("#ffffff", 0.07) : alpha("#1e34b3", 0.16),
                  minHeight: isDark ? "auto" : 252,
                }}
              >
                {!isDark && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: 16,
                      bottom: -16,
                      fontSize: 150,
                      fontWeight: 700,
                      lineHeight: 1,
                      color: alpha("#ffffff", 0.14),
                    }}
                  >
                    ∞
                  </Box>
                )}
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: alpha("#ffffff", isDark ? 0.7 : 0.78),
                  }}
                >
                  {isDark ? "Source: Transmission-primary-alpha-99" : "Recent Generation"}
                </Typography>
                <Typography
                  sx={{
                    mt: 2,
                    fontSize: { xs: "2rem", md: "2.35rem" },
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    maxWidth: 760,
                    wordBreak: "break-word",
                  }}
                >
                  {recentTitle}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    color: isDark ? alpha("#ffffff", 0.76) : alpha("#d9e1ff", 0.9),
                    maxWidth: 780,
                    wordBreak: "break-word",
                  }}
                >
                  {isDark ? null : `Original: ${recentOriginal}`}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 4, flexWrap: "wrap" }}>
                  <Button
                    onClick={handleCopy}
                    startIcon={copied ? <DoneRounded /> : <ContentCopyRounded />}
                    variant={isDark ? "contained" : "outlined"}
                    sx={{
                      minWidth: 148,
                      bgcolor: isDark ? "#3a3a3a" : "#ffffff",
                      color: isDark ? "#ffffff" : theme.palette.primary.main,
                      borderColor: alpha("#ffffff", 0.18),
                      "&:hover": {
                        bgcolor: isDark ? "#464646" : alpha("#ffffff", 0.92),
                        borderColor: alpha("#ffffff", 0.3),
                      },
                    }}
                  >
                    {copied ? "Copied" : "Copy Link"}
                  </Button>
                  <Button
                    startIcon={<QrCode2Rounded />}
                    variant={isDark ? "contained" : "outlined"}
                    sx={{
                      minWidth: 148,
                      bgcolor: isDark ? "#3a3a3a" : alpha("#ffffff", 0.08),
                      color: "#ffffff",
                      borderColor: alpha("#ffffff", 0.18),
                      "&:hover": {
                        bgcolor: isDark ? "#464646" : alpha("#ffffff", 0.14),
                        borderColor: alpha("#ffffff", 0.3),
                      },
                    }}
                  >
                    {isDark ? "" : "QR Code"}
                  </Button>
                </Stack>
              </Paper>
            </Box>

            {!isDark && (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 4,
                  border: "1px solid #ebe8e1",
                  boxShadow: "0 20px 45px rgba(34, 54, 127, 0.04)",
                  display: "flex",
                  alignItems: "center",
                  minHeight: 252,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "text.secondary",
                    }}
                  >
                    Network Savings
                  </Typography>
                  <Typography
                    sx={{
                      mt: 2,
                      fontSize: { xs: "3rem", md: "3.4rem" },
                      fontWeight: 700,
                      letterSpacing: "-0.06em",
                    }}
                  >
                    1.2 MB
                  </Typography>
                  <Typography sx={{ mt: 1, color: theme.palette.primary.main, fontWeight: 600 }}>
                    ^ +12% this month
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>

          <Box sx={{ mt: { xs: 6, md: 8 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <SectionEyebrow dark={isDark}>
                {isDark ? "Transmission History" : "Recent Activity"}
              </SectionEyebrow>
              <Typography sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                View All
              </Typography>
            </Stack>

            {isDark ? (
              <Stack spacing={2.5} sx={{ mt: 3 }}>
                {historyRows.map((row) => (
                  <Paper
                    key={row.title}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      p: 3,
                      bgcolor: "#191919",
                      border: "1px solid rgba(255,255,255,0.06)",
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "2fr 0.65fr 0.65fr 0.55fr 40px" },
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{row.shortUrl}</Typography>
                      <Typography sx={{ mt: 0.5, color: "text.secondary" }}>
                        {row.title}
                      </Typography>
                    </Box>
                    <MetricBlock label="Clicks" value={row.clicks} />
                    <MetricBlock label="Last Ping" value={row.ping} />
                    <Chip
                      label="ACTIVE"
                      size="small"
                      sx={{
                        justifySelf: { md: "start" },
                        bgcolor: "transparent",
                        border: "1px solid rgba(74, 222, 255, 0.35)",
                        color: theme.palette.primary.main,
                        borderRadius: 1.5,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                      }}
                    />
                    <IconButton color="inherit" sx={{ justifySelf: "end" }}>
                      <MoreHorizRounded />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  mt: 3,
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid #ebe8e1",
                  boxShadow: "0 20px 45px rgba(34, 54, 127, 0.04)",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#fbfaf8" }}>
                      {["Link Title", "Short URL", "Clicks", "Status", "Action"].map((heading) => (
                        <TableCell
                          key={heading}
                          sx={{
                            py: 2.2,
                            color: "text.secondary",
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            borderBottom: "1px solid #f0ece5",
                          }}
                        >
                          {heading}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyRows.map((row, index) => (
                      <TableRow key={row.title}>
                        <TableCell
                          sx={{
                            py: 3,
                            borderBottom:
                              index === historyRows.length - 1 ? "none" : "1px solid #f5f2ec",
                          }}
                        >
                          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{row.title}</Typography>
                          <Typography sx={{ mt: 0.5, color: "text.secondary", fontSize: 14 }}>
                            {row.created}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: 18,
                            borderBottom:
                              index === historyRows.length - 1 ? "none" : "1px solid #f5f2ec",
                          }}
                        >
                          {row.shortUrl}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: 18,
                            fontWeight: 700,
                            borderBottom:
                              index === historyRows.length - 1 ? "none" : "1px solid #f5f2ec",
                          }}
                        >
                          {row.clicks}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom:
                              index === historyRows.length - 1 ? "none" : "1px solid #f5f2ec",
                          }}
                        >
                          <Chip
                            label="ACTIVE"
                            size="small"
                            sx={{
                              bgcolor: "#d9f8e6",
                              color: "#179c59",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            borderBottom:
                              index === historyRows.length - 1 ? "none" : "1px solid #f5f2ec",
                          }}
                        >
                          <IconButton>
                            <MoreHorizRounded />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Container>

        <Divider />
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={3}
            sx={{ py: 6 }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: isDark ? theme.palette.primary.main : "#2845c7",
                }}
              >
                {env.appName}
              </Typography>
              <Typography sx={{ mt: 1, color: "text.secondary", letterSpacing: "0.1em" }}>
                © 2024 SUB-ZERO. HIGH-SPEED PRECISION.
              </Typography>
            </Box>
            <Stack direction="row" spacing={4} sx={{ color: "text.secondary", letterSpacing: "0.14em" }}>
              <Typography>TERMS</Typography>
              <Typography>PRIVACY</Typography>
              {!isDark && <Typography>API DOCS</Typography>}
            </Stack>
          </Stack>
        </Container>

        {loading && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha("#000000", 0.24),
              zIndex: 30,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

function SectionEyebrow({ children, dark }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 36,
          height: 2,
          bgcolor: dark ? "#22d3ff" : "rgba(40, 69, 199, 0.28)",
        }}
      />
      <Typography
        sx={{
          fontSize: dark ? 14 : 18,
          fontWeight: 700,
          letterSpacing: dark ? "0.22em" : "-0.04em",
          textTransform: dark ? "uppercase" : "none",
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

function MetricBlock({ label, value }) {
  return (
    <Box>
      <Typography
        sx={{
          color: "text.secondary",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ mt: 0.4, fontSize: 18, fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}

export default App;
