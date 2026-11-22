import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Visibility,
  VisibilityOff,
  LockReset,
  PhoneAndroid,
} from "@mui/icons-material";
import { motion } from "framer-motion";

import {
  sendMobileResetOtp,
  verifyResetOtp,
  resetPassword,
} from "../../services/auth.service";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  // --------------------------------------------------
  // STEP 1 - SEND OTP
  // --------------------------------------------------
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    setError("");
    setSuccessMsg("");

    const cleanMobile = mobile.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const response = await sendMobileResetOtp({
        mobile: cleanMobile,
      });

      const msg =
        response?.message ||
        response?.data?.message ||
        "OTP sent successfully to your mobile number.";

      setMobile(cleanMobile);
      setSuccessMsg(msg);
      setResendTimer(60);
      setStep(2);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // STEP 2 - VERIFY OTP
  // --------------------------------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMsg("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyResetOtp({
        mobile,
        otp,
      });

      const data = response?.data || response;

      if (!data?.resetToken) {
        throw new Error("Reset token was not received.");
      }

      setResetToken(data.resetToken);
      setStep(3);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // STEP 3 - RESET PASSWORD
  // --------------------------------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      setError(
        "Password must include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        mobile,
        resetToken,
        password,
        confirmPassword,
      });

      navigate("/login", {
        state: {
          message:
            "Password updated successfully. Please login with your new password.",
        },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // STEP INDICATOR
  // --------------------------------------------------
  const StepIndicator = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          mb: 4,
        }}
      >
        {[1, 2, 3].map((item) => (
          <React.Fragment key={item}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                backgroundColor: step >= item ? "#2e7d32" : "#e0e0e0",
                color: step >= item ? "#ffffff" : "#777777",
                transition: "all 0.3s ease",
              }}
            >
              {item}
            </Box>

            {item !== 3 && (
              <Box
                sx={{
                  width: 35,
                  height: 2,
                  backgroundColor: step > item ? "#2e7d32" : "#e0e0e0",
                  transition: "background-color 0.3s ease",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7f5 0%, #e8f0e8 100%)",
        px: 2,
        py: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "450px" }}
      >
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            width: "100%",
          }}
        >
          {/* Back button */}
          <IconButton
            onClick={() => navigate("/login")}
            sx={{ color: "#2e7d32", mb: 1 }}
          >
            <ArrowBack />
          </IconButton>

          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "#e8f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px",
              }}
            >
              <LockReset sx={{ fontSize: 32, color: "#2e7d32" }} />
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#2e7d32", mb: 1 }}
            >
              Forgot Password?
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Reset your password using your registered mobile number.
            </Typography>
          </Box>

          <StepIndicator />

          {/* Error Alert */}
          {error && (
            <Box
              sx={{
                backgroundColor: "#ffebee",
                border: "1px solid #ef9a9a",
                borderRadius: 1,
                px: 2,
                py: 1.5,
                mb: 2,
              }}
            >
              <Typography color="error" fontSize={14}>
                {error}
              </Typography>
            </Box>
          )}

          {/* Success Alert */}
          {successMsg && !error && (
            <Box
              sx={{
                backgroundColor: "#e8f5e9",
                border: "1px solid #a5d6a7",
                borderRadius: 1,
                px: 2,
                py: 1.5,
                mb: 2,
              }}
            >
              <Typography sx={{ color: "#1b5e20", fontSize: 13.5 }}>
                {successMsg}
              </Typography>
            </Box>
          )}

          {/* =========================================
              STEP 1 - ENTER MOBILE NUMBER
          ========================================= */}
          {step === 1 && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSendOtp}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Enter Mobile Number
              </Typography>

              <TextField
                fullWidth
                placeholder="Enter 10-digit registered mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                inputProps={{ maxLength: 10, inputMode: "numeric" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroid sx={{ color: "#2e7d32" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#2e7d32" },
                  },
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#2e7d32",
                  py: 1.4,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: 16,
                  "&:hover": { backgroundColor: "#1b5e20" },
                }}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </motion.form>
          )}

          {/* =========================================
              STEP 2 - VERIFY OTP
          ========================================= */}
          {step === 2 && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleVerifyOtp}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Enter OTP
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter the 6-digit OTP sent to <strong>+91 {mobile}</strong>
              </Typography>

              <TextField
                fullWidth
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                inputProps={{ maxLength: 6, inputMode: "numeric" }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#2e7d32" },
                  },
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#2e7d32",
                  py: 1.4,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: 16,
                  "&:hover": { backgroundColor: "#1b5e20" },
                }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="text"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError("");
                    setSuccessMsg("");
                  }}
                  sx={{ color: "#2e7d32", textTransform: "none", fontSize: 13 }}
                >
                  Change Number
                </Button>

                <Button
                  variant="text"
                  disabled={loading || resendTimer > 0}
                  onClick={() => handleSendOtp()}
                  sx={{ color: "#2e7d32", textTransform: "none", fontSize: 13 }}
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </Button>
              </Box>
            </motion.form>
          )}

          {/* =========================================
              STEP 3 - CREATE NEW PASSWORD
          ========================================= */}
          {step === 3 && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleResetPassword}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Create New Password
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Use at least 8 characters with uppercase, lowercase, number, and
                special symbol.
              </Typography>

              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#2e7d32" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#2e7d32" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#2e7d32" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#2e7d32" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
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

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#2e7d32",
                  py: 1.4,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: 16,
                  "&:hover": { backgroundColor: "#1b5e20" },
                }}
              >
                {loading ? "Updating Password..." : "Reset Password"}
              </Button>
            </motion.form>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ForgotPassword;