import "./App.css";
import {
  Box,
  Container,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useState, useCallback } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import { ReactTyped } from "react-typed";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import DoneIcon from "@mui/icons-material/Done";

function App() {
  const [Url, setUrl] = useState("");
  const [ShortUrl, setShortUrl] = useState("");
  const [backdropState, setbackdropState] = useState(false);
  const [copied, setCopied] = useState(false);


  const copyToClipboard = async () => {
    const permissionStatus = await navigator.permissions.query({ name: 'clipboard-write' });
    if (permissionStatus.state === 'granted') {
    await navigator.clipboard.writeText(ShortUrl);
    //await navigator.clipboard.writeText(ShortUrl);
    }
    else {
    alert('Clipboard access denied. Please allow clipboard access in your browser settings.'); 
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
    // clearTimeout(timeout)
  };


  const callBackend = useCallback(async () => {
    if (Url===""){
      alert("Please Enter an URL")
      return
    }
    else{
      setbackdropState(true);
    try {
      var response = await axios.get("http://localhost:5000/generate", {
        params: { url: Url },
      });
      //console.log(response.data.message);
      setShortUrl(response.data.message);
      setbackdropState(false);
    } catch (e) {
      console.log(e);
      console.log("Error: ", e.message);
    }}
  }, [setbackdropState, Url, setShortUrl]);

  return (
    <>
      <Grid container spacing={0}>
        <Grid
          size={{ md:6, lg: 6}}
          sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block" } }}
        >
          <Container sx={{ minHeight: "100vh" }}>
            <Box className="image-box">
              <Typography className="title">Sub-Zero</Typography>
              <ReactTyped
                className="sub-title"
                strings={["A simplified solution for shortening URLs"]}
                typeSpeed={90}
                loop
              />
              <img src="/hero.svg" alt="hero" className="hero-image" />
              <Box sx={{ textAlign: "justify" }}>
                <Typography className="description-box">
                  Sub-Zero is a fast and reliable link shortener that makes
                  sharing long URLs effortless. Simplify your links, track
                  clicks, and customize them for a seamless sharing experience.
                </Typography>
              </Box>
            </Box>
          </Container>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <Container className="outer-form-box">
            <Box className="form-box">
            <Typography className="title">Sub-Zero</Typography>
              <TextField
                className="custom-textfield"
                multiline
                maxRows={5}
                sx={{

                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Default border color
                    },
                    "&:hover fieldset": {
                      borderColor: "white", // Border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white", // Border color when focused
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "black", // Label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "white", // Label color when focused
                  },
                }}
                id="url"
                // label="Enter Url"
                placeholder="Enter Url"
                value={Url}
                size="medium"
                fullWidth
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
              <Button
                variant="contained"
                color="success"
                onClick={callBackend}
                size='large'
                endIcon={<LinkIcon/>}
              >
                Get Shortened Url
              </Button>
              <Button
                variant="contained"
                color="warning"
                size='large'
                endIcon={<DeleteIcon/>}
                onClick={() => {
                  setUrl("");
                  setShortUrl("")
                }}
              >
                &emsp;&emsp;Clear Fields&emsp;&emsp;
              </Button>
              <Typography sx={{}}>Shortened URL</Typography>
              <Box sx={{ backgroundColor: "white",width:"100%" }}>
                <Box sx={{ textAlign: "right"}}>
                  <Button sx={{ color: "gray" }} onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <DoneIcon sx={{ fontSize: "20px" }} />
                        <Typography sx={{ fontSize: "12px" }}>
                          Copied
                        </Typography>
                      </>
                    ) : (
                      <><ContentCopyIcon sx={{ fontSize: "20px" }} /><Typography sx={{ fontSize: "12px" }}>Copy</Typography></>
                    )}
                  </Button>
                </Box>
                <TextField
                  multiline
                  fullWidth
                  maxRows={4}
                  value={ShortUrl}
                  className="custom-textfield"
                                   
                />
              </Box>

              <Backdrop className="z-index-backdrop" open={backdropState}>
                <CircularProgress sx={{ color: "white" }} />
              </Backdrop>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
