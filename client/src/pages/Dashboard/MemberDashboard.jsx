
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import ScanAndPay from "../../assets/images/ScanAndPay.png";


const MemberDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [openSuccess, setOpenSuccess] = useState(false);


  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 4,
        px: 2,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        color="success.main"
        mb={3}
      >
        Welcome, {user?.name || "Member"}
      </Typography>

      <Card elevation={4}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            My Profile
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography fontWeight="bold">
                User ID
              </Typography>

              <Typography>
                {user?.userId || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight="bold">
                Referral Code
              </Typography>

              <Typography>
                {user?.referralCode || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight="bold">
                Name
              </Typography>

              <Typography>
                {user?.name || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight="bold">
                Email
              </Typography>

              <Typography>
                {user?.email || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight="bold">
                Mobile
              </Typography>

              <Typography>
                {user?.mobile || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight="bold">
                Role
              </Typography>

              <Chip
                label={user?.role || "MEMBER"}
                color="success"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight="bold">
                Wallet Balance
              </Typography>

              <Typography>
                ₹ {user?.walletBalance ?? 0}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight="bold">
                SP Balance
              </Typography>

              <Typography>
                {user?.spBalance ?? 0}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight="bold">
                KYC Status
              </Typography>

              <Chip
                label={user?.isKycVerified ? "Verified" : "Pending"}
                color={user?.isKycVerified ? "success" : "warning"}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight="bold">
                Account Status
              </Typography>

              <Chip
                label={user?.isActive ? "Active" : "Inactive"}
                color={user?.isActive ? "success" : "error"}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* ================= Welcome Kit Payment ================= */}

<Card
  elevation={4}
  sx={{
    mt: 4,
    borderRadius: 3,
  }}
>
  <CardContent>
    <Typography
      variant="h5"
      fontWeight="bold"
      color="success.main"
      gutterBottom
    >
      🎁 Welcome Kit Payment
    </Typography>

    <Divider sx={{ mb: 3 }} />

    <Typography
      variant="body1"
      color="text.secondary"
      mb={3}
    >
      To activate your Bhagyamma Hub Membership, complete the Welcome Kit
      payment of <strong>₹2,000</strong>.
    </Typography>

    <Grid container spacing={4} alignItems="center">
      {/* QR Code */}
      <Grid item xs={12} md={5}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              p: 2,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <img
              src={ScanAndPay}
              alt="Scan & Pay"
              style={{
                width: "100%",
                maxWidth: 250,
                display: "block",
              }}
            />
          </Box>
        </Box>
      </Grid>

      {/* Payment Details */}
      <Grid item xs={12} md={7}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
        >
          ₹2,000
        </Typography>

        <Typography
          sx={{ mt: 2 }}
          color="text.secondary"
        >
          Scan the QR code using any UPI application like:
        </Typography>

        <Typography
          sx={{ mt: 1 }}
          fontWeight="bold"
        >
          • Google Pay
        </Typography>

        <Typography fontWeight="bold">
          • PhonePe
        </Typography>

        <Typography fontWeight="bold">
          • Paytm
        </Typography>

        <Typography fontWeight="bold">
          • BHIM UPI
        </Typography>

<Button
  fullWidth
  variant="contained"
  color="success"
  size="large"
  sx={{
    mt: 4,
    py: 1.5,
    borderRadius: 2,
  }}
  onClick={() => setOpenSuccess(true)}
>
  Thank You For Choosing Us
</Button>

<Snackbar
  open={openSuccess}
  autoHideDuration={5000}
  onClose={() => setOpenSuccess(false)}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <Alert
    severity="success"
    variant="filled"
    onClose={() => setOpenSuccess(false)}
  >
    <strong>Payment Submitted Successfully!</strong>
    <br />
    Thank you for completing your payment.
    <br />
    Our team will verify your payment and contact you shortly with the next steps.
  </Alert>
</Snackbar>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          fontWeight="bold"
          color="error"
        >
          After Payment
        </Typography>

        <Typography
          sx={{ mt: 1 }}
          color="text.secondary"
        >
          After completing the payment, please send your payment screenshot
          through WhatsApp for verification and further order processing.
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          color="success.main"
          sx={{ mt: 2 }}
        >
          📞 +91 6363645068
        </Typography>

        <Button
          variant="outlined"
          color="success"
          sx={{ mt: 2 }}
          href="https://wa.me/916363645068"
          target="_blank"
        >
          Contact on WhatsApp
        </Button>
      </Grid>
    </Grid>
  </CardContent>
</Card>
    </Box>
  );
};

export default MemberDashboard;