import { useState } from "react";
import { motion } from "framer-motion";

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

const pageVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.35,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const iconVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: 0.15,
      ease: "easeOut",
    },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay,
      ease: "easeOut",
    },
  }),
};

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
      component={motion.div}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true }}
      sx={{
        minHeight: "100vh",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        px: {
          xs: 1,
          sm: 1.5,
        },

        py: {
          xs: 2,
          sm: 3,
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
              xs: 0.75,
              sm: 1,
            },

            borderRadius: 0,

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
        component={motion.div}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        elevation={0}
        sx={{
          width: "100%",

          maxWidth: 460,

          borderRadius: 0,

          border:
            "1px solid #2E7D32",

          boxShadow: "none",

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
              xs: 1.5,
              sm: 2,
            },

            py: {
              xs: 2,
              sm: 2.5,
            },

            textAlign: "center",
          }}
        >
          <Box
            component={motion.div}
            variants={iconVariants}
            initial="hidden"
            animate="visible"
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

              mb: 1,

              borderRadius: 0,

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
            component={motion.h4}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            custom={0.22}
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
            component={motion.p}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            custom={0.32}
            sx={{
              mt: 0.5,

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
              xs: 1.5,
              sm: 2,
            },
          }}
        >

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 1.25,

                borderRadius: 0,

                border: "1px solid #2E7D32",
              }}
            >
              {error}
            </Alert>
          )}


          <Box
            component={motion.form}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            custom={0.42}
            onSubmit={handleSubmit}
            noValidate
          >

            <Stack spacing={1.25}>

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
                component={motion.div}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                custom={0.52}
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
                component={motion.button}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  y: 0,
                }}
                transition={{
                  duration: 0.18,
                }}
                fullWidth
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disabled={loading}
                sx={{
                  mt: 0.5,

                  py: {
                    xs: 1,
                    sm: 1.1,
                  },

                  minHeight: 42,

                  borderRadius: 0,

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
            component={motion.hr}
            initial={{
              opacity: 0,
              scaleX: 0.8,
            }}
            animate={{
              opacity: 1,
              scaleX: 1,
            }}
            transition={{
              duration: 0.4,
              delay: 0.65,
            }}
            sx={{
              my: 1.5,
            }}
          />


          {/* REGISTER */}

          <Typography
            component={motion.p}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              delay: 0.72,
            }}
            textAlign="center"
            color="text.secondary"
            fontSize={14}
          >
            Don't have an account?
          </Typography>

          <Button
            component={motion(Link)}
            whileHover={{
              y: -2,
            }}
            whileTap={{
              y: 0,
            }}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              delay: 0.78,
            }}
            to="/register"
            fullWidth
            variant="outlined"
            color="success"
            sx={{
              mt: 0.75,

              py: 1,

              minHeight: 42,

              borderRadius: 0,

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