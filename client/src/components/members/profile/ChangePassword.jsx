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
      elevation={2}
      sx={{
        borderRadius: 4,
        mb: 3,
      }}
    >

      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Change Password
        </Typography>

        <Grid
          container
          spacing={3}
        >

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
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">

                    <IconButton
                      onClick={() =>
                        setShowCurrent(!showCurrent)
                      }
                    >

                      {

                        showCurrent

                          ?

                          <VisibilityOff />

                          :

                          <Visibility />

                      }

                    </IconButton>

                  </InputAdornment>
                ),
              }}
            />

          </Grid>

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
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">

                    <IconButton
                      onClick={() =>
                        setShowNew(!showNew)
                      }
                    >

                      {

                        showNew

                          ?

                          <VisibilityOff />

                          :

                          <Visibility />

                      }

                    </IconButton>

                  </InputAdornment>
                ),
              }}
            />

            <Box mt={2}>

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
                  height: 8,
                  borderRadius: 5,
                }}
              />

              <Typography
                mt={1}
                variant="body2"
                color="text.secondary"
              >
                Password Strength : {strength}%
              </Typography>

            </Box>

          </Grid>

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
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">

                    <IconButton
                      onClick={() =>
                        setShowConfirm(!showConfirm)
                      }
                    >

                      {

                        showConfirm

                          ?

                          <VisibilityOff />

                          :

                          <Visibility />

                      }

                    </IconButton>

                  </InputAdornment>
                ),
              }}
            />

          </Grid>

          <Grid item xs={12}>

            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleSubmit}
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