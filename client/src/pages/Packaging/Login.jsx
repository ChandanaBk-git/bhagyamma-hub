import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";

import { packagingLogin } from "../../api/packaging.api";

const PackagingLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    loginId: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // CHECK EXISTING PACKAGING LOGIN
  // =====================================================

  useEffect(() => {
    const token =
      localStorage.getItem("packagingToken");

    const user = JSON.parse(
      localStorage.getItem("packagingUser") ||
        "null"
    );

    if (
      token &&
      user?.role === "PACKAGING"
    ) {
      navigate(
        "/packaging/dashboard",
        { replace: true }
      );
    }
  }, [navigate]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "loginId"
          ? value.toUpperCase()
          : value,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const loginId =
      form.loginId.trim().toUpperCase();

    const password =
      form.password;

    if (!loginId) {
      setError(
        "Please enter your Login ID."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await packagingLogin({
          loginId,
          password,
        });

      /*
       * Expected backend response:
       *
       * {
       *   success: true,
       *   data: {
       *     token: "...",
       *     user: {
       *       id,
       *       name,
       *       loginId,
       *       role: "PACKAGING",
       *       branchId,
       *       branchName
       *     }
       *   }
       * }
       */

      const responseData =
        response?.data?.data ||
        response?.data ||
        response;

      const token =
        responseData?.token;

      const user =
        responseData?.user;

      if (!token) {
        throw new Error(
          "Authentication token was not received."
        );
      }

      if (
        !user ||
        String(user.role).toUpperCase() !==
          "PACKAGING"
      ) {
        throw new Error(
          "Invalid Packaging account."
        );
      }

      // =================================================
      // STORE PACKAGING SESSION
      // =================================================

      localStorage.setItem(
        "packagingToken",
        token
      );

      localStorage.setItem(
        "packagingUser",
        JSON.stringify(user)
      );

      // =================================================
      // REDIRECT
      // =================================================

      navigate(
        "/packaging/dashboard",
        { replace: true }
      );
    } catch (err) {
      console.error(
        "PACKAGING LOGIN ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Invalid Login ID or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: {
            xs: 3,
            sm: 4,
          },
          borderRadius: 4,
          border:
            "1px solid #d1fae5",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* =================================================
            LOGO / ICON
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #14532d, #16a34a)",
              color: "#fff",
              boxShadow:
                "0 8px 20px rgba(22,163,74,0.25)",
            }}
          >
            <LocalShippingRoundedIcon
              sx={{
                fontSize: 34,
              }}
            />
          </Box>
        </Box>

        {/* =================================================
            TITLE
        ================================================= */}

        <Typography
          variant="h5"
          align="center"
          fontWeight={700}
          sx={{
            color: "#14532d",
          }}
        >
          Packaging Team
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{
            mt: 0.5,
            mb: 3,
          }}
        >
          Sign in to manage your assigned orders
        </Typography>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
            }}
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        )}

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            label="Login ID"
            name="loginId"
            value={form.loginId}
            onChange={handleChange}
            required
            autoComplete="username"
            placeholder="Enter your Login ID"
            sx={{
              mb: 2,
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            placeholder="Enter your password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    edge="end"
                    type="button"
                  >
                    {showPassword ? (
                      <VisibilityOffRoundedIcon />
                    ) : (
                      <VisibilityRoundedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.35,
              borderRadius: 2,
              textTransform: "none",
              fontSize: 16,
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #14532d, #16a34a)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #166534, #15803d)",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={23}
                color="inherit"
              />
            ) : (
              "Login"
            )}
          </Button>
        </Box>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <Box
          sx={{
            mt: 3,
            p: 1.5,
            borderRadius: 2,
            backgroundColor:
              "#f0fdf4",
            border:
              "1px solid #dcfce7",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            display="block"
          >
            Use the Login ID and Password
            provided by the Admin.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PackagingLogin;