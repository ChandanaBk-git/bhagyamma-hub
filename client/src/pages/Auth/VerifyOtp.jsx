import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { verifyOtp } from "../../services/auth.service";

const VerifyOtp = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const email =
    location.state?.email || "";

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const value =
      e.target.value.replace(
        /\D/g,
        ""
      );

    if (value.length <= 6) {
      setOtp(value);
    }

    setError("");
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError(
        "Email information is missing. Please login again."
      );

      return;
    }

    if (!otp) {
      setError(
        "Please enter the OTP."
      );

      return;
    }

    if (otp.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await verifyOtp({
          email,
          otp,
        });

      const token =
        response?.data?.token;

      const user =
        response?.data?.user;

      if (!token || !user) {
        setError(
          "OTP verification response is incomplete. Please try again."
        );

        return;
      }

      /*
      ======================================================
      STORE VERIFIED AUTHENTICATION
      ======================================================
      */

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      /*
      ======================================================
      IMPORTANT — GUEST CART MERGE EVENT
      ======================================================

      If the customer added products
      before authentication:

      bhagyamma_guest_cart

      will be detected by CartContext.

      CartContext will then merge the
      guest products into the user's
      MongoDB cart.
      */

      window.dispatchEvent(
        new Event("auth-login")
      );

      /*
      ======================================================
      ROLE BASED NAVIGATION
      ======================================================
      */

      switch (user.role) {
        case "SUPER_ADMIN":
          navigate(
            "/admin/dashboard"
          );
          break;

        case "MANAGER":
          navigate(
            "/manager/dashboard"
          );
          break;

        case "SUPERVISOR":
          navigate(
            "/member/dashboard"
          );
          break;

        case "MEMBER":
          navigate(
            "/member/dashboard"
          );
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      console.error(
        "OTP ERROR:",
        err
      );

      setError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight:
          "calc(100vh - 75px)",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        px: 2,

        py: 5,

        background:
          "linear-gradient(135deg, #f5f8f3 0%, #ffffff 50%, #eef7ef 100%)",
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",

          maxWidth: 460,

          borderRadius: 4,

          border:
            "1px solid #e5e7eb",

          boxShadow:
            "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            textAlign="center"
          >
            Verify OTP
          </Typography>

          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{
              mt: 1,
              mb: 3,
            }}
          >
            Enter the OTP sent to
          </Typography>

          <Typography
            textAlign="center"
            fontWeight={700}
            sx={{
              mb: 3,
              wordBreak:
                "break-word",
            }}
          >
            {email ||
              "your email"}
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={
              handleSubmit
            }
            noValidate
          >
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="6-Digit OTP"
                value={otp}
                onChange={
                  handleChange
                }
                inputProps={{
                  maxLength: 6,

                  inputMode:
                    "numeric",

                  pattern:
                    "[0-9]*",

                  style: {
                    textAlign:
                      "center",

                    letterSpacing:
                      "8px",

                    fontSize:
                      "22px",

                    fontWeight: 700,
                  },
                }}
                autoFocus
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,

                  borderRadius:
                    2.5,

                  textTransform:
                    "none",

                  fontWeight: 700,

                  fontSize: 16,

                  boxShadow:
                    "none",

                  "&:hover": {
                    boxShadow:
                      "none",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  "Verify & Continue"
                )}
              </Button>
            </Stack>
          </Box>

          <Divider
            sx={{
              my: 3,
            }}
          />

          <Typography
            textAlign="center"
            fontSize={14}
            color="text.secondary"
          >
            Entered the wrong
            email?
          </Typography>

          <Button
            component={Link}
            to="/login"
            fullWidth
            color="success"
            sx={{
              mt: 1,

              textTransform:
                "none",

              fontWeight: 700,
            }}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyOtp;