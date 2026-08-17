import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  PersonOutline,
  HomeOutlined,
} from "@mui/icons-material";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { login } from "../../services/auth.service";

const LoginForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!form.password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: form.email
          .trim()
          .toLowerCase(),

        password: form.password,
      });

      const token =
        response?.data?.token;

      const user =
        response?.data?.user;

      if (!token || !user) {
        setError(
          "Login response is incomplete. Please try again."
        );

        return;
      }

      /* ==================================================
         STORE AUTHENTICATION
      ================================================== */

      if (rememberMe) {
        localStorage.setItem(
          "token",
          token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        sessionStorage.removeItem(
          "token"
        );

        sessionStorage.removeItem(
          "user"
        );
      } else {
        sessionStorage.setItem(
          "token",
          token
        );

        sessionStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );
      }

      /* ==================================================
         GUEST CART MERGE EVENT
      ================================================== */

      window.dispatchEvent(
        new Event("auth-login")
      );

      /* ==================================================
         ROLE BASED NAVIGATION
      ================================================== */

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

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error?.response?.data
          ?.message ||
          error?.message ||
          "Unable to login. Please check your credentials."
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

        px: {
          xs: 1.5,
          sm: 2,
        },

        py: {
          xs: 3,
          sm: 5,
        },

        background:
          "linear-gradient(135deg, #f5f8f3 0%, #ffffff 50%, #eef7ef 100%)",

        position: "relative",

        boxSizing: "border-box",
      }}
    >

      {/* ==================================================
          HOME NAVIGATION
      ================================================== */}

      <Box
        sx={{
          position: "absolute",

          top: {
            xs: 12,
            sm: 20,
          },

          left: {
            xs: 12,
            sm: 24,
          },

          zIndex: 10,
        }}
      >
        <Button
          component={Link}
          to="/"
          startIcon={
            <HomeOutlined />
          }
          variant="text"
          color="success"
          sx={{
            textTransform:
              "none",

            fontWeight: 700,

            fontSize: {
              xs: "0.85rem",
              sm: "0.95rem",
            },

            minWidth: "auto",

            px: {
              xs: 1,
              sm: 1.5,
            },

            borderRadius: 2,

            "&:hover": {
              backgroundColor:
                "rgba(46, 125, 50, 0.08)",
            },
          }}
        >
          Home
        </Button>
      </Box>


      {/* ==================================================
          LOGIN CARD
      ================================================== */}

      <Card
        elevation={0}
        sx={{
          width: "100%",

          maxWidth: 460,

          borderRadius: {
            xs: 2.5,
            sm: 4,
          },

          border:
            "1px solid #e5e7eb",

          boxShadow:
            "0 20px 50px rgba(0,0,0,0.08)",

          overflow: "hidden",

          mt: {
            xs: 3,
            sm: 2,
          },
        }}
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <Box
          sx={{
            background:
              "linear-gradient(135deg, #2e7d32 0%, #43a047 100%)",

            color: "#fff",

            px: {
              xs: 2.5,
              sm: 4,
            },

            py: {
              xs: 3,
              sm: 4,
            },

            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: {
                xs: 52,
                sm: 58,
              },

              height: {
                xs: 52,
                sm: 58,
              },

              mx: "auto",

              mb: 1.5,

              borderRadius: "50%",

              bgcolor:
                "rgba(255,255,255,0.16)",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            <PersonOutline
              sx={{
                fontSize: {
                  xs: 27,
                  sm: 30,
                },
              }}
            />
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              fontSize: {
                xs: "1.7rem",
                sm: "2.1rem",
              },
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            sx={{
              mt: 1,

              color:
                "rgba(255,255,255,0.88)",

              fontSize: {
                xs: 13,
                sm: 14,
              },
            }}
          >
            Login to your Bhagyamma Hub
            account
          </Typography>
        </Box>


        {/* ==================================================
            FORM CONTENT
        ================================================== */}

        <CardContent
          sx={{
            p: {
              xs: 2.5,
              sm: 4,
            },
          }}
        >

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
            onSubmit={handleSubmit}
            noValidate
          >

            <Stack spacing={2.2}>

              {/* EMAIL */}

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={
                  handleChange
                }
                autoComplete="email"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline color="action" />
                    </InputAdornment>
                  ),
                }}
              />


              {/* PASSWORD */}

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                autoComplete="current-password"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword(
                            (prev) =>
                              !prev
                          )
                        }
                        edge="end"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />


              {/* REMEMBER / FORGOT PASSWORD */}

              <Box
                sx={{
                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  gap: 1,

                  flexWrap:
                    "wrap",
                }}
              >

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        rememberMe
                      }
                      onChange={(e) =>
                        setRememberMe(
                          e.target
                            .checked
                        )
                      }
                      color="success"
                      size="small"
                    />
                  }
                  label={
                    <Typography
                      fontSize={14}
                    >
                      Remember me
                    </Typography>
                  }
                />

                <Link
                  to="/forgot-password"
                  style={{
                    color:
                      "#2e7d32",

                    textDecoration:
                      "none",

                    fontSize:
                      "14px",

                    fontWeight: 600,
                  }}
                >
                  Forgot password?
                </Link>

              </Box>


              {/* LOGIN BUTTON */}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disabled={loading}
                sx={{
                  mt: 1,

                  py: {
                    xs: 1.35,
                    sm: 1.5,
                  },

                  minHeight: 48,

                  borderRadius: 2.5,

                  textTransform:
                    "none",

                  fontSize: 16,

                  fontWeight: 700,

                  boxShadow: "none",

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
                  "Login"
                )}
              </Button>

            </Stack>

          </Box>


          <Divider
            sx={{
              my: 3,
            }}
          />


          {/* REGISTER */}

          <Typography
            textAlign="center"
            color="text.secondary"
            fontSize={14}
          >
            Don't have an account?
          </Typography>

          <Button
            component={Link}
            to="/register"
            fullWidth
            variant="outlined"
            color="success"
            sx={{
              mt: 1.5,

              py: 1.25,

              minHeight: 46,

              borderRadius: 2.5,

              textTransform:
                "none",

              fontWeight: 700,
            }}
          >
            Create New Account
          </Button>

        </CardContent>

      </Card>

    </Box>
  );
};

export default LoginForm;