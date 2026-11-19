
import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { Link } from "react-router-dom";

const DeleteAccount = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
        }}
      >
        <Stack spacing={3} alignItems="center" textAlign="center">
          <DeleteForeverOutlinedIcon
            sx={{ fontSize: 65, color: "error.main" }}
          />

          <Typography variant="h4" fontWeight={700}>
            Delete Your Bhagyamma Hub Account
          </Typography>

          <Typography color="text.secondary">
            You can request deletion of your Bhagyamma Hub account and
            associated personal information by following the steps below.
          </Typography>

          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="error"
            size="large"
          >
            Login to Request Account Deletion
          </Button>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" fontWeight={700} gutterBottom>
          Steps to delete your account
        </Typography>

        <Box component="ol" sx={{ pl: 3 }}>
          <li>
            <Typography sx={{ mb: 1 }}>
              Log in to your Bhagyamma Hub account.
            </Typography>
          </li>
          <li>
            <Typography sx={{ mb: 1 }}>
              Open Member Settings.
            </Typography>
          </li>
          <li>
            <Typography sx={{ mb: 1 }}>
              Select the Delete Account option.
            </Typography>
          </li>
          <li>
            <Typography sx={{ mb: 1 }}>
              Verify your account using the requested security verification.
            </Typography>
          </li>
          <li>
            <Typography>
              Confirm your deletion request.
            </Typography>
          </li>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Stack direction="row" spacing={2} alignItems="center">
          <SecurityOutlinedIcon color="primary" fontSize="large" />
          <Typography variant="h6" fontWeight={700}>
            What happens to your data?
          </Typography>
        </Stack>

        <Typography sx={{ mt: 2 }} fontWeight={600}>
          Information intended for deletion or anonymization
        </Typography>

        <Typography color="text.secondary">
          Personal profile information and contact details will be deleted
          or anonymized as applicable when the account deletion process is
          completed. Account access will be disabled.
        </Typography>

        <Typography sx={{ mt: 2 }} fontWeight={600}>
          Information that may be retained
        </Typography>

        <Typography color="text.secondary">
          Certain order, payment, wallet, commission, referral, and financial
          audit records may be retained where necessary for legal, accounting,
          security, or legitimate business requirements.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Bhagyamma Hub
          <br />
          For account deletion assistance, contact the support team through
          the official website.
        </Typography>
      </Paper>
    </Container>
  );
};

export default DeleteAccount;
