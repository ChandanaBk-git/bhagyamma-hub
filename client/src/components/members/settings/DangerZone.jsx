
import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import {
  DeleteForever,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { deleteMyAccount } from "../../../services/auth.service";

const DangerZone = () => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);

  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    localStorage.removeItem("member-settings");

    window.location.replace("/");
  };

  const openDeleteDialog = () => {
    setPassword("");
    setShowPassword(false);
    setConsent(false);
    setError("");
    setDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;

    setDeleteDialog(false);
    setConfirmDialog(false);
    setPassword("");
    setConsent(false);
    setError("");
  };

  // First confirmation: validate password and consent
  const handleContinue = () => {
    if (!password.trim()) {
      setError("Please enter your current password.");
      return;
    }

    if (!consent) {
      setError("Please accept the account deletion acknowledgement.");
      return;
    }

    setError("");
    setConfirmDialog(true);
  };

  // Final confirmation: call backend only after Yes
  const handleFinalDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      await deleteMyAccount(password);

      // Clear local session only after successful API response
      clearSession();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to delete your account. Please try again."
      );

      setDeleting(false);
      setConfirmDialog(false);
    }
  };

  return (
    <>
      {/* DELETE ACCOUNT CARD */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #F2DADA",
          bgcolor: "#FFFFFF",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DeleteForever color="error" />

            <Typography
              variant="h6"
              color="error"
              fontWeight={700}
            >
              Delete Account
            </Typography>
          </Stack>

          <Typography
            color="text.secondary"
            fontSize={13}
            sx={{ mt: 1, mb: 2.5 }}
          >
            Permanently delete your Bhagyamma Hub member account.
            This action cannot be undone.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<DeleteForever />}
            onClick={openDeleteDialog}
            sx={{
              borderRadius: 2,
              py: 1.3,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Delete My Account
          </Button>
        </CardContent>
      </Card>

      {/* PASSWORD AND CONSENT DIALOG */}
      <Dialog
        open={deleteDialog}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            color: "#E53935",
            fontWeight: 700,
          }}
        >
          Permanently Delete Account?
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Deleting your account will deactivate your member
            access and anonymize your personal and contact details.

            Your cart will be removed and you will be signed out.
            Orders, payments, wallet transactions, commissions,
            referral and selling-point records may be retained
            where required for accounting, legal or audit purposes.
          </DialogContentText>

          {/* <Alert severity="warning" sx={{ mb: 2 }}>
            This action is permanent and cannot be reversed.
            Only MEMBER accounts can use this option.
          </Alert> */}

          {/* CURRENT PASSWORD */}
          <TextField
            fullWidth
            autoFocus
            type={showPassword ? "text" : "password"}
            label="Current Password"
            placeholder="Enter your current password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            disabled={deleting}
            autoComplete="current-password"
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    edge="end"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
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

          {/* MANDATORY CONSENT */}
          <Box
            sx={{
              border: "1px solid #F0D6D6",
              borderRadius: 2,
              p: 1.5,
              bgcolor: "#FFF9F9",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={consent}
                  onChange={(event) => {
                    setConsent(event.target.checked);
                    setError("");
                  }}
                  disabled={deleting}
                  color="error"
                />
              }
              sx={{ alignItems: "flex-start", m: 0 }}
              label={
                <Typography
                  fontSize={13}
                  color="text.primary"
                  sx={{ pt: 0.8 }}
                >
                  I understand and acknowledge that my personal
                  details will be anonymized, my account access
                  will be permanently disabled, and this action
                  cannot be undone. I understand that certain
                  business and financial records may be retained
                  where legally required. I have reviewed these
                  consequences and voluntarily request account
                  deletion.
                </Typography>
              }
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={closeDeleteDialog}
            disabled={deleting}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleContinue}
            disabled={
              deleting ||
              !password.trim() ||
              !consent
            }
            startIcon={<DeleteForever />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Permanently Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* FINAL YES / NO CONFIRMATION */}
      <Dialog
        open={confirmDialog}
        onClose={() => {
          if (!deleting) setConfirmDialog(false);
        }}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            color: "#D32F2F",
            fontWeight: 700,
          }}
        >
          Are You Absolutely Sure?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Do you really want to permanently delete your
            Bhagyamma Hub member account?

            <br />
            <br />

            Your personal details will be anonymized and
            your account access will be disabled.
            You cannot undo this action.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            color="inherit"
            onClick={() => setConfirmDialog(false)}
            disabled={deleting}
            sx={{ textTransform: "none" }}
          >
            No, Go Back
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleFinalDelete}
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteForever />
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {deleting ? "Deleting..." : "Yes, Delete My Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DangerZone;
