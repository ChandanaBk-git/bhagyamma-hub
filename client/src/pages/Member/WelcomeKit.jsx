import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  CardGiftcard,
  CheckCircle,
  LocalShipping,
  VerifiedUser,
} from "@mui/icons-material";

const WelcomeKit = () => {
  const benefits = [
    "Membership activation",
    "Exclusive product access",
    "Support from the Bhagyamma team",
    "Priority updates for new launches",
  ];

  return (
    <Box sx={{ p: 3, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Welcome Kit
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Your welcome kit includes the essentials to start your journey with Bhagyamma Hub.
      </Typography>

      <Card elevation={2} sx={{ borderRadius: 4, mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ xs: "flex-start", md: "center" }}>
            <Box sx={{ bgcolor: "#E8F5E9", color: "#2E7D32", borderRadius: "50%", p: 2 }}>
              <CardGiftcard sx={{ fontSize: 40 }} />
            </Box>
            <Box flex={1}>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                Welcome Kit Status
              </Typography>
              <Chip label="Pending Verification" color="warning" />
              <Typography color="text.secondary" mt={2}>
                Our team will verify your account and process the welcome kit dispatch once your payment and documents are completed.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card elevation={2} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                What’s included
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                {benefits.map((benefit) => (
                  <Stack key={benefit} direction="row" spacing={1} alignItems="center">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography>{benefit}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card elevation={2} sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Dispatch Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <VerifiedUser color="success" />
                  <Typography>Account verification required</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocalShipping color="success" />
                  <Typography>Dispatch begins after approval</Typography>
                </Stack>
              </Stack>
              <Button variant="contained" color="success" fullWidth sx={{ mt: 3 }} href="/member/profile">
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WelcomeKit;