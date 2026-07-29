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
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    referralCode: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register({
        ...form,
        welcomeKitBonus: 500,
      });

      alert("Registration Successful");

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <Grid container justifyContent="center" mt={5}>
      <Grid item xs={11} md={5}>
        <Card>
          <CardContent>

            <Typography variant="h4" mb={3}>
              Register
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
            >

              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Mobile"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Referral Code"
                name="referralCode"
                value={form.referralCode}
                onChange={handleChange}
              />

              <TextField
                fullWidth
                type="password"
                margin="normal"
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />

              <Button
                fullWidth
                sx={{ mt: 3 }}
                variant="contained"
                type="submit"
              >
                Register
              </Button>

            </Box>

          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RegisterForm;