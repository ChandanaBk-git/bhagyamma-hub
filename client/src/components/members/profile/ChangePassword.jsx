import { useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  LinearProgress,
  Box,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Lock,
} from "@mui/icons-material";


const ChangePassword = ({ onSubmit }) => {

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const getStrength = () => {

    const password = form.newPassword;

    let score = 0;

    if (password.length >= 8) score++;

    if (/[A-Z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score * 25;

  };


  const strength = getStrength();


  const handleSubmit = () => {

    if (
      form.newPassword !== form.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    onSubmit?.(form);

  };


  return (

    <Card
      elevation={0}
      sx={{
        width: "100%",

        mb: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        borderRadius: 0,

        border: "1px solid #E0E0E0",

        boxShadow: "none",

        backgroundColor: "#FFFFFF",

        overflow: "hidden",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: "9px",
            sm: "12px",
            md: "15px",
          },

          "&:last-child": {
            pb: {
              xs: "9px",
              sm: "12px",
              md: "15px",
            },
          },
        }}
      >

        {/* HEADER */}

        <Typography
          fontWeight={600}
          sx={{
            fontSize: {
              xs: "14px",
              sm: "16px",
              md: "18px",
            },

            lineHeight: 1.2,

            mb: {
              xs: "10px",
              sm: "12px",
              md: "15px",
            },

            color: "#292929",
          }}
        >
          Change Password
        </Typography>


        <Grid
          container
          spacing={{
            xs: 1.25,
            sm: 1.5,
            md: 2,
          }}
        >

          {/* CURRENT PASSWORD */}

          <Grid item xs={12}>

            <TextField
              fullWidth
              name="currentPassword"
              label="Current Password"
              value={form.currentPassword}
              onChange={handleChange}
              type={
                showCurrent
                  ? "text"
                  : "password"
              }

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock
                      sx={{
                        fontSize: {
                          xs: 17,
                          sm: 19,
                        },

                        color: "#2E7D32",
                      }}
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">

                    <IconButton
                      size="small"
                      onClick={() =>
                        setShowCurrent(!showCurrent)
                      }
                    >

                      {showCurrent
                        ? <VisibilityOff fontSize="small" />
                        : <Visibility fontSize="small" />}

                    </IconButton>

                  </InputAdornment>
                ),
              }}

              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 0,

                  minHeight: {
                    xs: 42,
                    sm: 44,
                  },

                  fontSize: {
                    xs: "11px",
                    sm: "12px",
                    md: "13px",
                  },
                },

                "& .MuiInputLabel-root": {
                  fontSize: {
                    xs: "11px",
                    sm: "12px",
                  },
                },
              }}
            />

          </Grid>


          {/* NEW PASSWORD */}

          <Grid item xs={12}>

            <TextField
              fullWidth
              name="newPassword"
              label="New Password"
              value={form.newPassword}
              onChange={handleChange}
              type={
                showNew
                  ? "text"
                  : "password"
              }

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock
                      sx={{
                        fontSize: {
                          xs: 17,
                          sm: 19,
                        },

                        color: "#2E7D32",
                      }}
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">

                    <IconButton
                      size="small"
                      onClick={() =>
                        setShowNew(!showNew)
                      }
                    >

                      {showNew
                        ? <VisibilityOff fontSize="small" />
                        : <Visibility fontSize="small" />}

                    </IconButton>

                  </InputAdornment>
                ),
              }}

              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 0,

                  minHeight: {
                    xs: 42,
                    sm: 44,
                  },

                  fontSize: {
                    xs: "11px",
                    sm: "12px",
                    md: "13px",
                  },
                },

                "& .MuiInputLabel-root": {
                  fontSize: {
                    xs: "11px",
                    sm: "12px",
                  },
                },
              }}
            />


            {/* PASSWORD STRENGTH */}

            <Box
              sx={{
                mt: {
                  xs: "6px",
                  sm: "8px",
                },
              }}
            >

              <LinearProgress
                variant="determinate"
                value={strength}
                color={
                  strength < 50
                    ? "error"
                    : strength < 75
                    ? "warning"
                    : "success"
                }

                sx={{
                  height: {
                    xs: 5,
                    sm: 6,
                  },

                  borderRadius: 0,

                  backgroundColor: "#EEEEEE",
                }}
              />


              <Typography
                color="text.secondary"
                sx={{
                  mt: "3px",

                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                    md: "11px",
                  },

                  lineHeight: 1.2,
                }}
              >
                Password Strength : {strength}%
              </Typography>

            </Box>

          </Grid>


          {/* CONFIRM PASSWORD */}

          <Grid item xs={12}>

            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              type={
                showConfirm
                  ? "text"
                  : "password"
              }

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock
                      sx={{
                        fontSize: {
                          xs: 17,
                          sm: 19,
                        },

                        color: "#2E7D32",
                      }}
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">

                    <IconButton
                      size="small"
                      onClick={() =>
                        setShowConfirm(!showConfirm)
                      }
                    >

                      {showConfirm
                        ? <VisibilityOff fontSize="small" />
                        : <Visibility fontSize="small" />}

                    </IconButton>

                  </InputAdornment>
                ),
              }}

              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 0,

                  minHeight: {
                    xs: 42,
                    sm: 44,
                  },

                  fontSize: {
                    xs: "11px",
                    sm: "12px",
                    md: "13px",
                  },
                },

                "& .MuiInputLabel-root": {
                  fontSize: {
                    xs: "11px",
                    sm: "12px",
                  },
                },
              }}
            />

          </Grid>


          {/* UPDATE BUTTON */}

          <Grid item xs={12}>

            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleSubmit}
              sx={{
                minHeight: {
                  xs: 36,
                  sm: 40,
                },

                px: {
                  xs: 2,
                  sm: 2.5,
                },

                borderRadius: 0,

                boxShadow: "none",

                fontSize: {
                  xs: "10px",
                  sm: "11px",
                  md: "12px",
                },

                fontWeight: 600,

                textTransform: "none",

                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              Update Password
            </Button>

          </Grid>

        </Grid>

      </CardContent>

    </Card>

  );

};


export default ChangePassword;