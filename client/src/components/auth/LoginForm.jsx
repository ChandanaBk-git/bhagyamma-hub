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
import { login } from "../../services/authService";

const LoginForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(form);

      console.log("Login Response:", response);

      // Support different backend response formats
      const result = response.data;

      const token =
        result.token ||
        result.data?.token ||
        result.result?.token;

      const user =
        result.user ||
        result.data?.user ||
        result.result?.user;

      if (!token || !user) {
        console.error("Invalid login response:", result);
        alert("Login response is invalid. Check console.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <Grid container justifyContent="center" mt={5}>
      <Grid item xs={11} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" mb={3}>
              Login
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                type="submit"
              >
                Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LoginForm;