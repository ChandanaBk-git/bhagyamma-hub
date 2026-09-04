import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  QrCode2,
} from "@mui/icons-material";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { register } from "../../services/auth.service";

// =====================================================
// TEMPORARY REGISTRATION FORM STORAGE
// =====================================================

const REGISTRATION_STORAGE_KEY =
  "bhagyamma_registration_form";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
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
  hidden: { opacity: 0, scale: 0.8 },
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
  hidden: { opacity: 0, y: 12 },
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

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // INITIAL FORM DATA
  // =====================================================

  const getInitialFormData = () => {
    try {
      const savedData =
        sessionStorage.getItem(
          REGISTRATION_STORAGE_KEY
        );

      if (savedData) {
        const parsedData =
          JSON.parse(savedData);

        return {
          name: parsedData?.name || "",
          email: parsedData?.email || "",
          mobile: parsedData?.mobile || "",
          password: parsedData?.password || "",
          confirmPassword:
            parsedData?.confirmPassword || "",
          referralCode:
            parsedData?.referralCode || "",
        };
      }
    } catch (error) {
      console.error(
        "Unable to restore registration form:",
        error
      );
    }

    return {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    };
  };

  const [formData, setFormData] =
    useState(getInitialFormData);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =====================================================
  // RESTORE FORM WHEN RETURNING FROM PAYMENT SCANNER
  // =====================================================

  useEffect(() => {
    try {
      const savedData =
        sessionStorage.getItem(
          REGISTRATION_STORAGE_KEY
        );

      if (!savedData) {
        return;
      }

      const parsedData =
        JSON.parse(savedData);

      setFormData({
        name: parsedData?.name || "",
        email: parsedData?.email || "",
        mobile: parsedData?.mobile || "",
        password: parsedData?.password || "",
        confirmPassword:
          parsedData?.confirmPassword || "",
        referralCode:
          parsedData?.referralCode || "",
      });
    } catch (error) {
      console.error(
        "Unable to restore registration data:",
        error
      );
    }
  }, [location.key]);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

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

  // =====================================================
  // SAVE REGISTRATION FORM TEMPORARILY
  // =====================================================

  const saveRegistrationForm = () => {
    try {
      sessionStorage.setItem(
        REGISTRATION_STORAGE_KEY,
        JSON.stringify(formData)
      );
    } catch (error) {
      console.error(
        "Unable to save registration form:",
        error
      );
    }
  };

  // =====================================================
  // OPTIONAL REGISTRATION PAYMENT
  //
  // IMPORTANT:
  // This is only the ₹2,000 membership payment.
  // It is NOT product payment.
  // =====================================================

  const handleRegistrationPayment = () => {
    setError("");
    setSuccess("");

    // Save everything entered so far.
    saveRegistrationForm();

    navigate(
      "/membership-payment",
      {
        state: {
          from: "register",
        },
      }
    );
  };

  // =====================================================
  // VALIDATION
  // =====================================================

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

  // =====================================================
  // REGISTER
  // =====================================================

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
        await register(payload);

      const token =
        response?.data?.token ||
        response?.token;

      const user =
        response?.data?.user ||
        response?.user;

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

      // =================================================
      // REGISTRATION SUCCESS
      //
      // Remove temporary form data only after
      // successful registration.
      // =================================================

      sessionStorage.removeItem(
        REGISTRATION_STORAGE_KEY
      );

      setSuccess(
        response?.data?.message ||
          response?.message ||
          "Registration successful."
      );

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
      component={motion.div}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
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
        component={motion.div}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        elevation={0}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
          },
          "& .MuiButton-root": {
            borderRadius: 0,
          },
          width: "100%",

          maxWidth: 650,

          borderRadius: 0,

          border:
            "1px solid #e5e7eb",

          boxShadow:
            "0 20px 50px rgba(0,0,0,0.08)",

          overflow: "hidden",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

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
            component={motion.div}
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            sx={{
              width: 58,

              height: 58,

              mx: "auto",

              mb: 2,

              borderRadius: 0,

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
            component={motion.h4}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            custom={0.22}
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
            component={motion.p}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            custom={0.32}
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

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <Alert
              component={motion.div}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 0,
              }}
            >
              {error}
            </Alert>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (
            <Alert
              component={motion.div}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 0,
              }}
            >
              {success}
            </Alert>
          )}

          {/* =================================================
              REGISTRATION FORM
          ================================================= */}

          <Box
            component={motion.form}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            custom={0.4}
            onSubmit={handleSubmit}
            noValidate
          >
            <Grid
              container
              spacing={2.2}
            >

              {/* FULL NAME */}

              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.mobile}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlined color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* REFERRAL CODE */}

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

                    borderRadius: 0,

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

              {/* =================================================
                  OPTIONAL ₹2,000 REGISTRATION PAYMENT
              ================================================= */}

              <Grid
                item
                xs={12}
              >
                <Button
                  component={motion.button}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  transition={{ duration: 0.18 }}
                  fullWidth
                  type="button"
                  variant="outlined"
                  color="success"
                  size="large"
                  onClick={
                    handleRegistrationPayment
                  }
                  startIcon={
                    <QrCode2 />
                  }
                  sx={{
                    py: 1.35,

                    borderRadius: 0,

                    textTransform:
                      "none",

                    fontSize: 15,

                    fontWeight: 700,

                    borderWidth: 1.5,

                    "&:hover": {
                      borderWidth: 1.5,
                    },
                  }}
                >
                  Pay Registration Fee ₹2,000

                  <Box
                    component="span"
                    sx={{
                      ml: 0.5,

                      fontSize: 12,

                      fontWeight: 600,

                      opacity: 0.75,
                    }}
                  >
                    (Optional)
                  </Box>
                </Button>

                <Typography
                  align="center"
                  color="text.secondary"
                  sx={{
                    mt: 1,

                    fontSize: 12,

                    lineHeight: 1.5,
                  }}
                >
                  Registration payment is
                  optional. You can register
                  without paying this fee.
                </Typography>
              </Grid>

              {/* CREATE ACCOUNT */}

              <Grid
                item
                xs={12}
              >
                <Button
                  component={motion.button}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  transition={{ duration: 0.18 }}
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 1,

                    py: 1.5,

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
                    "Create Account"
                  )}
                </Button>
              </Grid>

            </Grid>
          </Box>

          {/* LOGIN */}

          <Divider
            component={motion.hr}
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            sx={{
              my: 3,
            }}
          />

          <Stack
            component={motion.div}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.76 }}
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