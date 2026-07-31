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
import { login } from "../../services/auth.service";

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

    console.log("LOGIN RESPONSE:", response);

    const token = response.data?.token;
    const user = response.data?.user;

    if (!token || !user) {
      alert("Token or User not found!");
      console.log(response);
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log("Saved Token:", localStorage.getItem("token"));

switch (user.role) {
  case "SUPER_ADMIN":
    navigate("/admin/dashboard");
    break;

  case "MANAGER":
    navigate("/manager/dashboard");
    break;

  case "MEMBER":
    navigate("/dashboard");
    break;

  default:
    navigate("/");
}
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