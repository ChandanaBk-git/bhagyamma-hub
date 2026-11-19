
import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import {
  DeleteForever,
  LockOutlined,
  SupportAgent,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const DeleteAccount = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F6F8F7",
        py: { xs: 4, sm: 7 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3,
            border: "1px solid #E5EAE6",
          }}
        >
          <Stack alignItems="center" spacing={1.5}>
            <DeleteForever
              sx={{ fontSize: 48, color: "#D32F2F" }}
            />

            <Typography
              variant="h4"
              fontWeight={800}
              textAlign="center"
              color="#263C2D"
            >
              Delete Your Account
            </Typography>

            <Typography
              color="text.secondary"
              textAlign="center"
              fontSize={14}
            >
              Bhagyamma Hub Account Deletion Request
            </Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography fontWeight={700} mb={1}>
            How to request account deletion
          </Typography>

          <Typography color="text.secondary" fontSize={14}>
            If you have a Bhagyamma Hub member account and
            want to permanently delete it, follow these steps:
          </Typography>

          <Box component="ol" sx={{ pl: 2.5, color: "#555", fontSize: 14 }}>
            <li>Log in to your Bhagyamma Hub member account.</li>
            <li>Open Member Settings.</li>
            <li>Select Delete Account.</li>
            <li>Complete the required account verification.</li>
            <li>Review the deletion information and confirm your request.</li>
          </Box>

          <Button
            component={Link}
            to="/login"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.3,
              bgcolor: "#315C3B",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#264A2E" },
            }}
          >
            Login to Request Account Deletion
          </Button>

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <LockOutlined color="action" />

            <Box>
              <Typography fontWeight={700} fontSize={14}>
                Data that will be deleted
              </Typography>
              <Typography color="text.secondary" fontSize={13}>
                Personal profile and contact information will be
                deleted or anonymized, subject to applicable
                legal and business retention requirements.
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{ mt: 2.5 }}
          >
            <SupportAgent color="action" />

            <Box>
              <Typography fontWeight={700} fontSize={14}>
                Data that may be retained
              </Typography>
              <Typography color="text.secondary" fontSize={13}>
                Certain order, payment, wallet, commission,
                referral and financial audit records may be
                retained where required by law or legitimate
                accounting obligations. Applicable retention
                periods depend on the record type.
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography
            fontSize={12}
            color="text.secondary"
            textAlign="center"
          >
            Bhagyamma Hub
            <br />
            Account deletion information
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default DeleteAccount;
