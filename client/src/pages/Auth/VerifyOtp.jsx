import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../services/authService";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await verifyOtp({
        email,
        otp,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <Grid container justifyContent="center" mt={5}>
      <Grid item xs={11} md={4}>
        <Card>
          <CardContent>

            <Typography variant="h4" mb={2}>
              Verify OTP
            </Typography>

            <Typography mb={2}>
              OTP sent to
              <br />
              <strong>{email}</strong>
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>

              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                type="submit"
              >
                Verify OTP
              </Button>

            </Box>

          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default VerifyOtp;