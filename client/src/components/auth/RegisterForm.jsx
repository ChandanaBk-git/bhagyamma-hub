import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  EmailOutlined,
  PhoneOutlined,
  LockOutlined,
  GroupsOutlined,
} from "@mui/icons-material";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { register } from "../../services/auth.service";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    let updatedValue = value;

    if (name === "mobile") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    if (name === "referralCode") {
      updatedValue =
        value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    const name =
      formData.name.trim();

    const email =
      formData.email
        .trim()
        .toLowerCase();

    const mobile =
      formData.mobile.trim();

    const password =
      formData.password;

    const confirmPassword =
      formData.confirmPassword;

    const referralCode =
      formData.referralCode
        .trim()
        .toUpperCase();

    if (!name) {
      return "Please enter your full name.";
    }

    if (name.length < 3) {
      return "Name must contain at least 3 characters.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (
      !/^[6-9]\d{9}$/.test(
        mobile
      )
    ) {
      return "Please enter a valid 10-digit Indian mobile number.";
    }

    if (!password) {
      return "Please create a password.";
    }

    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }

    if (
      !/[!@#$%^&*(),.?":{}|<>]/.test(
        password
      )
    ) {
      return "Password must contain at least one special character.";
    }

    if (
      password !==
      confirmPassword
    ) {
      return "Passwords do not match.";
    }

    if (!referralCode) {
      return "Please enter a referral code. If you don't have one, use BHMANAGER001.";
    }

    return "";
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    try {
      setLoading(true);

      const payload = {
        name:
          formData.name.trim(),

        email:
          formData.email
            .trim()
            .toLowerCase(),

        mobile:
          formData.mobile.trim(),

        password:
          formData.password,

        referralCode:
          formData.referralCode
            .trim()
            .toUpperCase(),
      };

      const response =
        await register(
          payload
        );

      /*
       * Registration creates the account.
       *
       * We intentionally do NOT use
       * mobile OTP here.
       */

      const token =
        response?.data?.token ||
        response?.token;

      const user =
        response?.data?.user ||
        response?.user;

      /*
       * Store login session if backend
       * returns JWT.
       */

      if (token) {
        localStorage.setItem(
          "token",
          token
        );
      }

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      setSuccess(
        response?.data?.message ||
          response?.message ||
          "Registration successful."
      );

      /*
       * Give the user a moment to
       * see the success message.
       */

      setTimeout(() => {
        navigate(
          "/login",
          {
            replace: true,
          }
        );
      }, 1500);
    } catch (err) {
      console.error(
        "REGISTRATION ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Registration failed. Please try again."
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

        justifyContent:
          "center",

        alignItems:
          "center",

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

          maxWidth: 650,

          borderRadius: 4,

          border:
            "1px solid #e5e7eb",

          boxShadow:
            "0 20px 50px rgba(0,0,0,0.08)",

          overflow: "hidden",
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            background:
              "linear-gradient(135deg, #2e7d32 0%, #43a047 100%)",

            color: "#fff",

            px: {
              xs: 3,
              sm: 4,
            },

            py: 4,

            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 58,

              height: 58,

              mx: "auto",

              mb: 2,

              borderRadius: "50%",

              bgcolor:
                "rgba(255,255,255,0.16)",

              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",
            }}
          >
            <PersonOutline
              sx={{
                fontSize: 30,
              }}
            />
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              fontSize: {
                xs: "1.8rem",
                sm: "2.1rem",
              },
            }}
          >
            Create Your Account
          </Typography>

          <Typography
            sx={{
              mt: 1,

              color:
                "rgba(255,255,255,0.88)",

              fontSize: 14,
            }}
          >
            Join the Bhagyamma Hub
            community
          </Typography>
        </Box>

        <CardContent
          sx={{
            p: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          {/* ERROR */}

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

          {/* SUCCESS */}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 2,
              }}
            >
              {success}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={
              handleSubmit
            }
            noValidate
          >
            <Grid
              container
              spacing={2.2}
            >
              {/* NAME */}

              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="name"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* EMAIL */}

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="email"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* MOBILE */}

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobile"
                  value={
                    formData.mobile
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="tel"
                  inputProps={{
                    maxLength: 10,
                    inputMode:
                      "numeric",
                  }}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* REFERRAL */}

              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Referral ID"
                  name="referralCode"
                  value={
                    formData.referralCode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your team leader's referral ID"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GroupsOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{
                    mt: 1.5,

                    p: 1.5,

                    borderRadius: 2,

                    bgcolor:
                      "#f1f8f2",

                    border:
                      "1px solid #d7ead8",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                    }}
                  >
                    If you don't have a
                    referral code, use
                    the direct manager
                    referral code:

                    <Box
                      component="span"
                      sx={{
                        ml: 0.5,

                        fontWeight: 800,

                        color:
                          "#2e7d32",
                      }}
                    >
                      BHMANAGER001
                    </Box>
                  </Typography>
                </Box>
              </Grid>

              {/* PASSWORD */}

              <Grid
                item
                xs={12}
                sm={6}
              >
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
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="new-password"
                  required
                  helperText="Minimum 8 characters"
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
              </Grid>

              {/* CONFIRM PASSWORD */}

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    formData.confirmPassword
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="new-password"
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
                            setShowConfirmPassword(
                              (prev) =>
                                !prev
                            )
                          }
                          edge="end"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* REGISTER */}

              <Grid
                item
                xs={12}
              >
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 1,

                    py: 1.5,

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
                    "Create Account"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider
            sx={{
              my: 3,
            }}
          />

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0.5}
            flexWrap="wrap"
          >
            <Typography
              color="text.secondary"
              fontSize={14}
            >
              Already have an account?
            </Typography>

            <Button
              component={Link}
              to="/login"
              color="success"
              sx={{
                textTransform:
                  "none",

                fontWeight: 700,

                minWidth: "auto",

                p: 0.5,
              }}
            >
              Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterForm;